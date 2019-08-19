import React, { Component } from 'react';
import './App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Motion, spring } from 'react-motion';
import NavigationPanel from './components/NavigationPanel';
import Modal from './components/Modal';
import Coin from "./pages/Coin";
import axios from "axios";

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
				console.log(response.data);
				if (!response.data.user) {
					self.setState({
						pageMounted: "loginAndSignup",
						loggedInUser: ""
					})
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
					<Coin />
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
