import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;
import axios from "axios";
 
class LineChart extends Component {
	
	state = {
		data : []
	}
	
	componentDidMount() {
         this.getData(this.props.Ids[0]);
	}
	

	getData = (id) => {

		let self = this
		axios.get("/api/coins/history/" + id).then (function(history){
			console.log(history.data);
			let data = []
            for (let i=1; i<history.data.Time.length; i++) {
			   data.push({
							 x: parseInt(history.data.Time[i]/86400) ,
							 y: history.data.Price[i]
			             })
			} 
            console.log("29 ----->", data);
			self.setState({data: data})
	})
	}


//    data1 = [
// 	{ x: 1, y: 64 },
// 	{ x: 2, y: 61 },
// 	{ x: 3, y: 64 },
// 	{ x: 4, y: 62 },
// 	{ x: 5, y: 64 },
// 	{ x: 6, y: 60 },
// 	{ x: 7, y: 58 },
// 	{ x: 8, y: 59 },
// 	{ x: 9, y: 53 },
// 	{ x: 10, y: 54 },
// 	{ x: 11, y: 61 },
// 	{ x: 12, y: 60 },
// 	{ x: 13, y: 55 },
// 	{ x: 14, y: 60 },
// 	{ x: 15, y: 56 },
// 	{ x: 16, y: 60 },
// 	{ x: 17, y: 59.5 },
// 	{ x: 18, y: 63 },
// 	{ x: 19, y: 58 },
// 	{ x: 20, y: 54 },
// 	{ x: 21, y: 59 },
// 	{ x: 22, y: 64 },
// 	{ x: 23, y: 59 }
// ] 


	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			title:{
				text: "Historical Chart"
			},
			axisY: {
				title: "USD",
				includeZero: false,
				prefix: "$"
			},
			axisX: {
				title: "Days",
				prefix: "D",
				// interval: 2
			},
			data: [{
				type: "line",
				toolTipContent: "Week {x}: {y}%",
				dataPoints: this.state.data
			}]
		}

		console.log("87 =======> ", this.state.data)
		
		return (
		<div>
			<h1>React Line Chart</h1>
			<CanvasJSChart options = {options} 
				/* onRef={ref => this.chart = ref} */
			/>
			{/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
		</div>
		);
	}
}

export default LineChart;                           