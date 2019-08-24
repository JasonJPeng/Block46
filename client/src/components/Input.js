import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import {MdVisibility} from 'react-icons/lib/md';

const Input = (props) => {

	let iconVisibility = null;

	if (props.type === 'password') {
		iconVisibility = (
			<MdVisibility className='iconVisibility'/>
		);
	}

	return (
		<div className="Input">
			<input 
				autoComplete="false"
				required
				{...props}
			/>
			{iconVisibility}
		</div>
	);
}

Input.propTypes = {
	id: PropTypes.string,
	type: PropTypes.string,
	placeholer: PropTypes.string
};


export default Input;