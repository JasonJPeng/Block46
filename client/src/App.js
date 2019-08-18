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
			password: ""
		};
	}

	componentDidMount() {
		this.setState({ mounted: true });
	}
	
	handleSignInSubmit = (e) => {
		e.preventDefault();
		console.log("submit sign in");
	}

	handleSignUpSubmit = (e) => {
		e.preventDefault();
		axios.post("/local/signup", {
			email : this.state.email,
			password : this.state.password
		}).then(function(response) {
			console.log("signup success");
			console.log(response);
		});
	}

	handleChangeForm = (event) => {
		const {name, value} = event.target;
		this.setState({[name] : value}, () => (console.log(this.state)));
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
						   onChangeForm={this.handleChangeForm}/>
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
