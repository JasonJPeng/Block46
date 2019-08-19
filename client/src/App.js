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
			pageMounted: "loginAndSignup",
			email: "",
			password: "",
			signupMsg: "",
			loginMsg: ""
		};
	}

	componentDidMount() {
		// check if a user has logged in when the component is mounted
		axios
		.get("/isloggedin")
		.then(function(response) {
			console.log(response.data);
		})
	}
	
	handleSignInSubmit = (e) => {
		e.preventDefault();
		let self = this;
		axios.post("/local/login", {
			email : this.state.email,
			password : this.state.password
		}).then(function(response) {
			self.setState({loginMsg : response.data.message,
						   signupMsg : ""});
			console.log(response.data.loginStatus)
		})
	}

	handleSignUpSubmit = (e) => {
		e.preventDefault();
		let self = this;
		axios.post("/local/signup", {
			email : this.state.email,
			password : this.state.password
		}).then(function(response) {
			self.setState({signupMsg : response.data.message,
						   loginMsg : ""});
			console.log(response.data.signupStatus);
		});
	}

	handleChangeForm = (event) => {
		const {name, value} = event.target;
		this.setState({[name] : value});
	}

	render() {
		const {pageMounted} = this.state;

		// The child is the main content to show
		// It will be login/signup page at the begining and then
		// it will be the cryptocurrency data profile after logging in
		let child;

		if("loginAndSignup" === pageMounted) {
			child = (
				<div className="App_test">
					<NavigationPanel></NavigationPanel>
					<Modal onSubmitSignIn={this.handleSignInSubmit}
					       onSubmitSignUp={this.handleSignUpSubmit}
						   onChangeForm={this.handleChangeForm}
						   signupMsg={this.state.signupMsg}
						   loginMsg={this.state.loginMsg}/>
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
