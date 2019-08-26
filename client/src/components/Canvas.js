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
		norm: []
	}

	// 
	originData = [];
	
	componentDidMount() {
        this.getData(this.props.Ids);
	}

	undoNormChart = (event) => {
		event.preventDefault();
		if (!this.state.isNorm)  return;

		let newData = JSON.parse(JSON.stringify(this.originData))
		let newTitle = this.state.symbols.join(" / ")

		this.setState({data:newData, title:newTitle, isNorm:false})
	}
	
	normalizeChart = (event) => {
		event.preventDefault();
		if (this.state.isNorm) return;

		let newData = this.state.data.map( (ele, idx)=>{
			    ele.dataPoints = ele.dataPoints.map(ele1=>{ 
					ele1.y = ele1.y/this.state.norm[idx];
					return ele1;
				})
			return ele;
		})

		let newSym = this.state.symbols.map( (e,i) => {return 1/this.state.norm[i]+ " x " + e})
		let newTitle = newSym.join(" / ")
		
		this.setState({data:newData, title:newTitle, isNorm:true})
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
		let data = [], prices=[], title="", norm=[], symbols=[];
	
		for (let i=0; i< Ids.length; i++) {
		   let self = this
		   let id = Ids[i];
		   let coinInfo = await self.getInfo(id);
		   let dataPoints = await self.getDataPoints(id);
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

        // Deep Copy of the original data
		this.originData = JSON.parse(JSON.stringify(data));

		let minNorm = Math.min(...norm)
		norm = norm.map(e=>e/minNorm) // use cheap coin as base
	
        title = symbols.join(" / ")
		this.setState({title, data, prices, norm, symbols})
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
			{this.state.isNorm?
			<button onClick={this.undoNormChart}>Original Chart</button>:
			<button onClick={this.normalizeChart}>Normalize the chart</button>
			}
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		    {/* <NewsInfo Ids={this.props.Ids} prices={this.state.chartInfo.prices} /> */}
		</div>
		);
	}
}

export default LineChart;                           