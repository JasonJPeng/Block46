import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import axios from "axios";

import NewsInfo from "../components/NewsInfo";
import { normalize } from 'path';
 
class LineChart extends Component {
	
	state = {
		base: "USD",
		isNorm: false,
		data: [],
		prices: [],
		symbols: [],
		names:[],
		arrayDataPoints: []
	}
// data array before normalization while arrayDataPoints in state isn the rezl origin in USD base
	G_original_data_array = [];  

// G_names, prices, symbols would be changed when the base chanegd, but the corresponding arrays in state would be changed.	
	G_symbols = [];	
	G_names = [];
	G_prices = [];
	G_norm = [];

	setGlobals = () => {
		this.G_names = Object.assign([], this.state.names);
		this.G_prices = Object.assign([], this.state.prices);
		this.G_symbols = Object.assign([], this.state.symbols);
	}

	componentDidMount() {
        this.getData(this.props.Ids);
	}

	// Start from here	
	//========================================================================================================
	getData = async (Ids) => {
		// let id = Ids[0];
		let data = [], prices=[], norm=[], symbols=[],names=[], arrayDataPoints=[];
	
		for (let i=0; i< Ids.length; i++) {
		   let self = this
		   let id = Ids[i];
		   let coinInfo = await self.getInfo(id);
		   let dataPoints = await self.getDataPoints(id);
		   arrayDataPoints.push(this.cloneDatapoints(dataPoints));
			 prices.push(coinInfo.Price)
			 symbols.push(coinInfo.Symbol)
			 names.push(coinInfo.Name)
			 this.G_norm.push(1);
			 // -- for CanvasJs   -- dataSeries
             data.push({						
				type: "line",
				name: `${coinInfo.Symbol} (${coinInfo.Name})`,   // use id identify different dataSearies
				yValueFormatString: "###,###.0000" ,
				xValueFormatString: "MMM-DD-YYYY" ,
				showInLegend: true, 
                legendText: ` (${coinInfo.Symbol}-${coinInfo.Name})=>$${coinInfo.Price} / `,
				// toolTipContent: ,
				radius: 1,
				dataPoints: dataPoints
			})
			let maxValue = Math.max(...dataPoints.map(element=>element.y))
			norm.push(10 ** parseInt(Math.log10(maxValue)));
		}
        
		// let minNorm = Math.min(...norm)
		// norm = norm.map(e=>e/minNorm) // use cheapest coin as base
  
		this.state.names = names;
		this.state.symbols = symbols;
		this.state.prices = prices;
		this.setGlobals();
	
		this.setState({data, arrayDataPoints})
		
	}

	getDataPoints = (id) => {
		return new Promise((resolve, reject) => {
		let self = this	;
		axios.get("/api/coins/history/" + id).then (function(history){			
			let dataPoints = []
            for (let i=1; i<history.data.Time.length; i++) {
			   dataPoints.push({
							 x: new Date(history.data.Time[i]*1000) ,
							 y: history.data.Price[i]
			             })
			}
			resolve(dataPoints); 
		})		
		})	
	}

	getInfo = (id) => {
		return new Promise((resolve, reject) => {
			axios.get("/api/coins/" + id).then (function(info){
				resolve(info.data);
			})	
		})	
	}
	
	//========================================================================================
	// Normalization 
	//=======================================================================================
	
	normalizeChart = (event) => {
		event.preventDefault();
		let newData=[];
		let self = this
		if (this.state.isNorm) { // recover to original
            self.G_norm = [];
            this.G_original_data_array.forEach(function(e) {
				newData.push(self.cloneCanvasData(e))
				self.G_norm.push(1);
			})
			
		} else {
            this.G_original_data_array = this.state.data.map(data=>{
				return self.cloneCanvasData(data);
			})
            newData = this.normalize(this.state.data)       
		}
        this.setState({data:newData, isNorm: !this.state.isNorm})
	}	

	normalize = (data) => {
		let norm = []
		data.forEach(function(e){
			let maxValue = Math.max(...e.dataPoints.map(element=>element.y))
			norm.push(10 ** parseInt(Math.log10(maxValue)));
		})
		let minNorm = Math.min(...norm)
		norm = norm.map(e=>e/minNorm) // use cheapest coin as base
        this.G_norm = norm;
		return data.map((element, i) =>{
			      element.radius = this.G_norm[i];  // save factor into radius
			      element.dataPoints = element.dataPoints.map(element2=>{
				         element2.y = element2.y/norm[i];
				          return element2;  
			      })
			      return element;
		        })
	}
 
	//=================================================================================


	changeBase = (arrayDataPoints, basePoints) => {
		// romove 0 value
		console.log(arrayDataPoints)
		console.log(basePoints)
		let newBase = []
		for (let i = basePoints.length-1; i >=0; i--) {
           if (basePoints[i].y > 0) {
			   newBase.unshift(basePoints[i]);
		   } else {
			   break;
		   }
		}
		console.log("newBase" , newBase)
		let newArrayDP=[];
        let newDP = [];
		arrayDataPoints.forEach(function(dp, idx){
			let diffL = dp.length - newBase.length;
            if (diffL>0 ) {  // get only the last newBase.length points				
				// get last 7 from 10 -> A.slice(3)    
				newDP = dp.slice( diffL); 			
			}  else if (diffL<0) {  // add |diffL| 0 for the shorter one
				let zeroArray = [];
				for(let i=0; i<(diffL*(-1)); i++) {
                    zeroArray.push({x:newBase[i].x, y:0});
				}
				newDP = [...zeroArray, ...dp];			
			} else {   // no need to change if both array are in the same length
                newDP = dp;
			}
			newArrayDP.push(newDP.map((pt, j)=>{pt.y = pt.y/newBase[j].y; return pt}))
		})
		console.log(newArrayDP)
	    return newArrayDP;

	}

	handleCurrencyChange = (event) => {
		event.preventDefault();
		const {value: baseCurrency}= event.target;
		let idx = this.state.symbols.indexOf(baseCurrency);
		let newDataPoints = this.state.arrayDataPoints.map(x=>this.cloneDatapoints(x));
		this.setGlobals();  // make G_symbols, names prices as state values
		
		if (idx >= 0) {
			let basePoints  = this.cloneDatapoints(newDataPoints[idx]);
			this.G_symbols[idx] = "$";
			this.G_names[idx] = "USD"
			this.G_prices[idx] = 1.0;
			newDataPoints[idx].map(point=>{point.y =1;  return point})  // make all 1's for the USD
			newDataPoints = this.changeBase(newDataPoints, basePoints)
			
			this.G_prices = this.G_prices.map(x=> x/this.state.prices[idx])
		} else {  // cased of USD base  
            // no need to change new data points
		}
		let newData = this.state.data;
		newData.map((d, i) => {
			d.dataPoints = newDataPoints[i];
			d.name = `${this.G_symbols[i]} (${this.G_names[i]})`;
			d.legendText= ` (${this.G_symbols[i]}-${this.G_names[i]})=>${this.G_prices[i].toFixed(4)} ${baseCurrency} / `;	
			return d;
		})

		// need to redo this.state.norm for different norm table
		this.setState({
			data:newData, 
			isNorm: false, 
			base: baseCurrency
		});	
	}

//    Deep Copy for this program
//====================================================================================================
	// deep copy for dataPoints  [{x:1, y:23}, {x:2, y:44}, .....]
	cloneDatapoints = (dataPoints) => {
		return dataPoints.map(x=> {return Object.assign({}, x)});
	}

	// copy Canvas data structure  
    cloneCanvasData = (data) => {
	  let newData = Object.assign({}, data)  // shadow copy
	  newData.dataPoints = this.cloneDatapoints(data.dataPoints);
	  return newData;
	}
//====================================================================================================

// functions for anvas JS  
//================================================================================================================
	formatToolTip =  ( e ) => {
		let yVal = this.state.isNorm ? e.entries[0].dataPoint.y * e.entries[0].dataSeries.radius : e.entries[0].dataPoint.y 
		let str = e.entries[0].dataSeries.name + "<br/>" + e.entries[0].dataPoint.x + "<br/>" + yVal;
		return str;
	}
	
	makeTitle = () => {
	   let str = this.state.base + " Base Historical Chart" ;
	   if (this.state.isNorm) {
		   str = "Normalized " + str;
	   }
		return str;
	}

	makeSubtitle = ()=> {
		let str = "";
		let self = this
		if (!self.state.isNorm) {
           self.G_symbols.forEach(function (e, i) {
               str += e + `(${self.G_names[i]})` + "    ";
		   })
		} else {
			self.G_symbols.forEach(function (e, i) {
				str +=  (1/self.G_norm[i]).toString() + " x " + e + `(${self.G_names[i]})` + "    " ;  
			})	
		}

		return str;
	}
//====================================================================================================================

	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1", // "light1", "dark1", "dark2"
			zoomEnabled: true,
			title:{
				text: this.makeTitle(),
				fontSize: 26,
				fontFamily: "tahoma",
				fontColor: "#6A5ACD"
			},
			subtitles:[{
				text: this.makeSubtitle(),
				fontSize: 16,
				fontFamily: "tahoma",
				fontColor: "#6A5ACD"
			}],
			axisY: {
				title: this.state.ytitle,
				includeZero: false,
				valueFormatString: "###,###.####",
				prefix: this.state.ySymbol
			},
			axisX: {
				title: "Date",
				xValueType: "dateTime",
				valueFormatString: "MMM-DD-YYYY",
				prefix: " "
				// interval: 2
			},
			toolTip:{
				contentFormatter: this.formatToolTip
			},		
			data: this.state.data
			// data: [{
			// 	type: "line",
			// 	toolTipContent: " {x}: $ {y}",
			// 	dataPoints: [ {x:01, y:22.3}, {}, {}, ...]
			// }]
		}

		
		return (
		<div>
			<h1>React Line Chart</h1>
			<CanvasJSChart options={options} 
				/* onRef={ref => this.chart = ref} */
			/>
			
			<button onClick={this.normalizeChart}>{
				this.state.isNorm? <span>Original Chart</span>: <span>Normalized Chart</span> 
			}</button>

            <select name="base" onChange={this.handleCurrencyChange}>
			  <option value="USD" selected> USD</option>
			  {this.state.symbols.map(x=>(	
				  <option  value={x}>{x}</option>  			  
			  ))  }          
            </select>

			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		    <NewsInfo Ids={this.props.Ids} prices={this.state.prices} />
		</div>
		);
	}
}

export default LineChart;                           