import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import axios from "axios";
 
class LineChart extends Component {
	
	state = {
		data : [],
		title: ""
	}
	
	componentDidMount() {
         this.getData(this.props.Ids);
	}
	
	normalizeChart = (event) => {
		event.preventDefault();
		let newData = [];
		console.log("State Data=> ", this.state.data)
		for (let i=0; i < this.state.data.length; i++) {
			let maxValue = Math.max(...this.state.data[i].dataPoints.map(element=>element.y));
			let factor = 10 ** parseInt(Math.log10(maxValue));
			console.log("factor->", factor)	
			let newPoints = this.state.data[i];
			newPoints.dataPoints.map(ele=> ele.y = ele.y/factor)
			newData.push(newPoints)				
		}

		this.setState({data: newData})
		
	}

	getDataPoints = (id) => {
		return new Promise((resolve, reject) => {
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
		let data = [];
		for (let i=0; i< Ids.length; i++) {
		   let self = this
		   let id = Ids[i];
		   let coinInfo = await self.getInfo(id);
		   let dataPoints = await self.getDataPoints(id);
        this.setState({title: this.state.title + " ~ " + coinInfo.Name})
		   
		   
            data.push({
				type: "line",
				showInLegend: true, 
                legendText: `(${coinInfo.Symbol}-${coinInfo.Name})=>$${coinInfo.Price} | `,
				toolTipContent: `${coinInfo.Symbol} {x} $ {y}`,
				dataPoints: dataPoints
		    })
            console.log("47 ----->", data);
	    }
	    this.setState({data: data})
	}


	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			zoomEnabled: true,
			title:{
				text: "Historical Chart: " + this.state.title
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
			// 	dataPoints: this.state.data
			// }]
		}

		console.log("87 =======> ", this.state.data)
		
		return (
		<div>
			<h1>React Line Chart</h1>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			<button onClick={this.normalizeChart}>Normalize the chart</button>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default LineChart;                           