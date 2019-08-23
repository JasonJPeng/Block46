import React, {Component } from 'react';
import {BrowserRouter as Router, Route, Link, Swtich} from 'react-router-dom';
import './App.css';
import { Motion, spring } from 'react-motion';
import NavigationPanel from './components/NavigationPanel';
import Coin from "./pages/Coin";
import axios from "axios";
import Home from "./components/Home";

class App extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pageMounted: "blank",
			email: "",
			password: "",
			signupMsg: "",
			loginMsg: "",
			loggedInUser: ""
		};
	}

	componentDidMount() {
		// check if a user has logged in when the component is mounted
		let self = this;
		axios
			.get("/isloggedin")
			.then(function (response) {
				if (!response.data.user) {
					self.setState({
						pageMounted: "loginAndSignup",
						loggedInUser: ""
					})
					console
				} else if (response.data.user.local) {
					self.setState({
						pageMounted: "coinPage",
						loggedInUser: response.data.user.local.email	// only support locally authenticated user
					});
				} else {
					self.setState({
						pageMounted: "coinPage",
						loggedInUser: ""
					})
				}
			})
	}

	handleSignInSubmit = (e) => {
		e.preventDefault();
		let self = this;
		axios.post("/local/login", {
			email: this.state.email,
			password: this.state.password
		}).then(function (response) {
			self.setState({
				loginMsg: response.data.message,
				signupMsg: ""
			});
			if ("SUCCESS" === response.data.loginStatus) {
				self.setState({
					pageMounted: "coinPage"
				}, () => (window.location.reload()));
			}
		})
	}

	handleSignUpSubmit = (e) => {
		e.preventDefault();
		let self = this;
		axios.post("/local/signup", {
			email: this.state.email,
			password: this.state.password
		}).then(function (response) {
			self.setState({
				signupMsg: response.data.message,
				loginMsg: ""
			});
			if ("SUCCESS" === response.data.signupStatus) {
				self.setState({
					pageMounted: "coinPage"
				}, () => (window.location.reload()))
			}
		});
	}

	handleChangeForm = (event) => {
		const { name, value } = event.target;
		this.setState({ [name]: value });
	}
	render() {
		return (
			<div>
				<Router>
					<Route exact path="/" component={Home} /> 
					<Route exact path="/coins" component={Coin} />
				</Router>
			</div>
		)
	}
	renderX() {
		const { pageMounted } = this.state;

		// The child is the main content to show
		// It will be login/signup page at the begining and then
		// it will be the cryptocurrency data profile after logging in
		let child;

		if ("loginAndSignup" === pageMounted) {
			child = (
				<div className="App">
					<ReactCSSTransitionGroup
						transitionName="example"
						transitionEnterTimeout={500}
						transitionLeaveTimeout={300}>
						<div className="App_test">
							<NavigationPanel></NavigationPanel>
							<Modal onSubmitSignIn={this.handleSignInSubmit}
								onSubmitSignUp={this.handleSignUpSubmit}
								onChangeForm={this.handleChangeForm}
								signupMsg={this.state.signupMsg}
								loginMsg={this.state.loginMsg} />
						</div>
					</ReactCSSTransitionGroup>
				</div>
			);
		} else if ("coinPage" === pageMounted) {
			child = (
				<div>
					<Coin username={this.state.loggedInUser}/>
				</div>
			);
		} else {
			child = (
				<div>

				</div>
			)
		}

		return (
			<div>
				{child}
			</div>
		);
	}
}

export default App;
