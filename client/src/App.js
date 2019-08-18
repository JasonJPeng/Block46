import React, {Component} from 'react';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Motion, spring} from 'react-motion';
import NavigationPanel from './components/NavigationPanel';
import Modal from './components/Modal';
import axios from "axios";

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			mounted: false,
			email: "",
			password: "",
			signupMsg: "",
			loginMsg: ""
		};
	}

	componentDidMount() {
		this.setState({ mounted: true });
	}
	
	handleSignInSubmit = (e) => {
		e.preventDefault();
		axios.post("/local/login", {
			email : this.state.email,
			password : this.state.password
		}).then(function(response) {
			console.log("login success");
			console.log(response);
		})
	}

	handleSignUpSubmit = (e) => {
		e.preventDefault();
		let self = this;
		axios.post("/local/signup", {
			email : this.state.email,
			password : this.state.password
		}).then(function(response) {
			console.log(response);
			self.setState({signupMsg : response.data.message});
		});
	}

	handleChangeForm = (event) => {
		const {name, value} = event.target;
		this.setState({[name] : value});
	}

	render() {
		const {mounted} = this.state;

		let child;
		let test = 12;

		if(mounted) {
			child = (
				<div className="App_test">
					<NavigationPanel></NavigationPanel>
					<Modal onSubmitSignIn={this.handleSignInSubmit}
					       onSubmitSignUp={this.handleSignUpSubmit}
						   onChangeForm={this.handleChangeForm}
						   signupMsg={this.state.signupMsg}/>
				</div>
			);
		}
		
		return(
			<div className="App">
				<ReactCSSTransitionGroup 
					transitionName="example"
					transitionEnterTimeout={500}
					transitionLeaveTimeout={300}>
						{child}
				</ReactCSSTransitionGroup>
			</div>
		);
	}
}

export default App;
