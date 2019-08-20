import React from 'react';
import '../App.css';
import {FaBitcoin} from "react-icons/lib/fa";
import {FaCircle} from 'react-icons/lib/fa';

const NavigationPanel = (props) => {

	return (
		<div className='NavigationPanel'>
			<FaBitcoin onClick={props.initialState} className='back'/>
			<div className='dots'>
				<FaCircle className='dotSelected' />
				<FaCircle className='dot' />
				<FaCircle className='dot' />
			</div>
			<div style={{flex: 2}}></div>
		</div>
	);
}



export default NavigationPanel;