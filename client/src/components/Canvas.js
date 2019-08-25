import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import axios from "axios";

import NewsInfo from "../components/NewsInfo";
 
class LineChart extends Component {
	
	state = {
		isNorm: false,
		title: "",
        chartInfo: {
	      symbols: [],		
		  data : [],
		  prices: [],
		  norm: [],
		  originDataPoints: []
		}  
	}
	
	componentDidMount() {
        this.getData(this.props.Ids);
	}
	
	normalizeChart = (event) => {
		event.preventDefault();
		if (this.state.isNorm) return;

		let newData = [];
		console.log("-------->", this.state.chartInfo)
		for (let i=0; i<this.state.chartInfo.data.length; i++) {
			let element = this.state.chartInfo.data[i];
			element.dataPoints = this.state.chartInfo.originDataPoints[i].map(ele=>{ 
														   ele.y = ele.y / this.state.chartInfo.norm[i];
														   return ele;
														});
			newData.push(element)
		}
		let newChartInfo = this.state.chartInfo;
		newChartInfo.data = newData;
		let newSym = this.state.chartInfo.symbols.map( (e,i) => {return 1/this.state.chartInfo.norm[i]+ " x " + e})
		let newTitle = newSym.join(" / ")
		this.setState({chartInfo:newChartInfo, isNorm: true, title: newTitle} )		
	}

	getDataPoints = (id) => {
		return new Promise((resolve, reject) => {
		let self = this	;
		axios.get("/api/coins/history/" + id).then (function(history){
			console.log(history.data);
			
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
		let chartInfo = {};
		let data = [];
		let prices = [];
		let title = "";
		let norm = [];
		let symbols = [];
		let originDataPoints = [];
		for (let i=0; i< Ids.length; i++) {
		   let self = this
		   let id = Ids[i];
		   let coinInfo = await self.getInfo(id);
		   let dataPoints = await self.getDataPoints(id);
		//    title = title + coinInfo.Name + " / ";
		   console.log("Price----->", coinInfo)
			prices.push(coinInfo.Price)
			symbols.push(coinInfo.Symbol)
            data.push({
				type: "line",
				showInLegend: true, 
                legendText: ` (${coinInfo.Symbol}-${coinInfo.Name})=>$${coinInfo.Price} / `,
				toolTipContent: `${coinInfo.Symbol} {x} $ {y}`,
				dataPoints: dataPoints
			})
			originDataPoints.push(dataPoints);
			// 	let maxValue = Math.max(...this.state.data[i].dataPoints.map(element=>{return element.y}));
			// 1 to 10 normalization  
			let maxValue = Math.max(...dataPoints.map(element=>element.y))
			norm.push(10 ** parseInt(Math.log10(maxValue)));
		}
		let minNorm = Math.min(...norm)
		norm = norm.map(e=>e/minNorm) // use cheap coin as base
		chartInfo = {data, symbols, norm, prices, originDataPoints}
        title = symbols.join(" / ")
		this.setState({title, chartInfo})
	}


	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
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
			data: this.state.chartInfo.data
			// data: [{
			// 	type: "line",
			// 	toolTipContent: " {x}: $ {y}",
			// 	dataPoints: this.state.data
			// }]
		}

		
		return (
		<div>
			<h1>React Line Chart</h1>
			<CanvasJSChart options={options} 
				/* onRef={ref => this.chart = ref} */
			/>
			<button onClick={this.normalizeChart}>Normalize the chart</button>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		    <NewsInfo Ids={this.props.Ids} prices={this.state.chartInfo.prices} />
		</div>
		);
	}
}

export default LineChart;                           