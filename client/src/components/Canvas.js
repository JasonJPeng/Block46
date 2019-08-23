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
							 x: new Date(history.data.Time[i]*1000) ,
							 y: history.data.Price[i]
			             })
			} 
            console.log("29 ----->", data);
			self.setState({data: data})
	})
	}


	render() {
		const options = {
			animationEnabled: true,
			exportEnabled: true,
			theme: "light2", // "light1", "dark1", "dark2"
			zoomEnabled: true,
			title:{
				text: "Historical Chart"
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
			data: [{
				type: "line",
				toolTipContent: " {x}: $ {y}",
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