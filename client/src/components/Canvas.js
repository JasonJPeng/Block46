import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import axios from "axios";

import NewsInfo from "../components/NewsInfo";
 
class LineChart extends Component {
	
	state = {
		isNorm: false,
		title: "",
		data: [],
		prices: [],
		symbols: [],
		norm: [],
		arrayDataPoints: []
	}

	
	componentDidMount() {
        this.getData(this.props.Ids);
	}

	
	normalizeChart = (event) => {
		event.preventDefault();

		console.log(this.state.arrayDataPoints)
		
		let newData = this.state.data.map( (ele, idx)=>{
			    ele.dataPoints = ele.dataPoints.map(ele1=>{ 
				ele1.y = this.state.isNorm? 
				         ele1.y*this.state.norm[idx]: 
				         ele1.y/this.state.norm[idx];
				return ele1;
				})
			return ele;
		})
		let newSym=[];
        if (!this.state.isNorm) {
		   newSym = this.state.symbols.map( (e,i) => {return 1/this.state.norm[i]+ " x " + e});
		} else {
		   newSym = this.state.symbols; 	
		}   
		let newTitle = newSym.join(" / ")
	
		this.setState({data:newData, title:newTitle, isNorm: !this.state.isNorm})
	
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
	
	
	getData = async (Ids) => {
		// let id = Ids[0];
		let data = [], prices=[], title="", norm=[], symbols=[], arrayDataPoints=[];
	
		for (let i=0; i< Ids.length; i++) {
		   let self = this
		   let id = Ids[i];
		   let coinInfo = await self.getInfo(id);
		   let dataPoints = await self.getDataPoints(id);
		   arrayDataPoints.push(this.cloneDatapoints(dataPoints));
			 prices.push(coinInfo.Price)
			 symbols.push(coinInfo.Symbol)
             data.push({
				type: "line",
				showInLegend: true, 
                legendText: ` (${coinInfo.Symbol}-${coinInfo.Name})=>$${coinInfo.Price} / `,
				toolTipContent: `${coinInfo.Symbol} {x} $ {y}`,
				dataPoints: dataPoints
			})
			let maxValue = Math.max(...dataPoints.map(element=>element.y))
			norm.push(10 ** parseInt(Math.log10(maxValue)));
		}

		let minNorm = Math.min(...norm)
		norm = norm.map(e=>e/minNorm) // use cheapest coin as base
	
        title = symbols.join(" / ")
		this.setState({title, data, prices, norm, symbols, arrayDataPoints})
	
	}

	// deep copy for dataPoints  [{x:1, y:23}, {x:2, y:44}, .....]
	cloneDatapoints = (dataPoints) => {
		return dataPoints.map(x=> {return Object.assign({}, x)});
	}


	changeBase = (arrayDataPoints, basePoints) => {
		// romve 0 value
		let newBase = []
		for (let i = basePoints.length-1; i >=0; i--) {
           if (basePoints.y >= 0) {
			   newBase.shift(basePoints[i]);
		   } else {
			   break;
		   }
		}
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
			newArrayDP.push(newDP.map(pt=>{pt.y/newBase[i].y; return pt}))
		})
	    return newArrayDP;

	}

	handleCurrencyChange = (event) => {
		event.preventDefault();
		const {value: baseCurrency}= event.target;
		let idx = this.state.symbols.indexOf(baseCurrency);
		let newDataPoints = this.state.arrayDataPoints.map(x=>this.cloneDatapoints(x));
		if (idx >= 0) {
			let basePoints  = this.cloneDatapoints(newDataPoints[idx]);
			newDataPoints[idx].map(point=>{point.y =1;  return point})  // make all 1's
			newDataPoints = this.changeBase(newDataPoints, basePoints);
		} else {  // cased of USD base
            // nothing
		}
		let newData = this.state.data;
		newData.map((data, i) => {
            data.dataPoints = newDataPoints[i];
			return data;
		})
		this.setState({data:newData, isNorm: false});	
	}

	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light1", // "light1", "dark1", "dark2"
			zoomEnabled: true,
			title:{
				text: this.state.title,
				fontSize: 20
			},
			axisY: {
				title: "USD",
				includeZero: false,
				prefix: "$"
			},
			axisX: {
				title: "Date",
				xValueType: "dateTime",
				prefix: " "
				// interval: 2
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