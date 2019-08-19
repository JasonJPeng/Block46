import React , {Component} from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import {Motion, spring} from 'react-motion';
import Input from './Input';
import SubmitButton from './SubmitButton';
import { MdEmail } from 'react-icons/lib/md';

class SignExpanded extends Component {

	constructor(props) {
		super(props);
		this.state = {
			flexState: false,
			animIsFinished: false,
		};
	}

	componentDidMount () {
     	this.setState({flexState: !this.state.flexState});  
  	}


	isFinished = () => {
		this.setState({animIsFinished: true});
	}

	render () {
		//console.log(this.props.onChangeForm);
		return (
			<Motion style={{
				flexVal: spring(this.state.flexState ? 8 : 1)
			}} onRest={this.isFinished}>
			{({flexVal}) =>
			<div className={this.props.type=='signIn' ? 'signInExpanded' : 'signUpExpanded'} style={{
				flexGrow: `${flexVal}`
			}}>
				<Motion style={{ 
					opacity: spring(this.state.flexState ? 1 : 0,{stiffness: 300, damping: 17}),
					y: spring(this.state.flexState ? 0 : 50, {stiffness: 100, damping: 17})
				 }} >
						{({opacity, y}) =>
						<form className='logForm' style={{
							WebkitTransform: `translate3d(0, ${y}px, 0)`,
							transform: `translate3d(0, ${y}px, 0)`,
							opacity: `${opacity}`
						}} onSubmit={this.props.type === 'signIn' ? this.props.onSubmitSignIn : this.props.onSubmitSignUp}>
							<h2>{this.props.type === 'signIn' ? 'SIGN IN' : 'SIGN UP'}</h2>
							<p>{this.props.type === 'signIn' ? this.props.loginMsg : this.props.signupMsg}</p>
							<Input
								id="email"
								type="email"
								name="email"
								placeholder="EMAIL"
								onChange={this.props.onChangeForm} />
							<Input
								id="password"
								type="password"
								name="password"
								placeholder="PASSWORD"
								onChange={this.props.onChangeForm} />
							<SubmitButton type={this.props.type}></SubmitButton>
							<a href="url" className='forgotPass'>{this.props.type == 'signIn' ? 'Forgot password?' : ''}</a>
						</form>
						}
				</Motion>
			</div>
		}
			</Motion>
		);
	}

}

SignExpanded.PropTypes ={
	type: PropTypes.string	
};

export default SignExpanded;