import React, { Component } from 'react';
import '../App.css';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import NavigationPanel from '../components/NavigationPanel';
import Modal from '../components/Modal';

import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect,
	withRouter
} from 'react-router-dom'

import Auth from "../util/Auth";

class Login extends Component {
    constructor(props) {
		super(props);
		this.state = {
			localLoginMsg : "",
            localSignupMsg : "",
            authenticated : false
		};
	}

	async componentDidMount() {
		// check if a user has logged in when the component is mounted
		await Auth.isAuth();
        await console.log(Auth.authResult);
        this.setState({authenticated : Auth.authResult.authenticated});
	}

	handleSignInSubmit = async (e) => {
		await e.preventDefault();
        await Auth.reqLocalAuthLogin();
        await this.setState({localLoginMsg : Auth.localAuth.loginMsg});
        console.log("in handleSignInSubmit");
        console.log(Auth.authResult);
        if (Auth.authResult.authenticated) {
            document.location.href = "/";
        }
	}

	handleSignUpSubmit = async (e) => {
		await e.preventDefault();
        await Auth.reqLocalAuthSignUp();
        await this.setState({localSignupMsg : Auth.localAuth.signupMsg});
        if (Auth.authResult.authenticated) {
            document.location.href = "/";
        }
	}

	handleChangeForm = (event) => {
		const { name, value } = event.target;
		Auth.setLocalAuth(name, value);
    }
    
    render() {
        const { from } = this.props.location.state || {from : {pathname : "/"}};
        const { authenticated } = this.state;

        if (authenticated) {
            return (
                <Redirect to={from} />
            );
        }

        return (
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
                            signupMsg={this.state.localSignupMsg}
                            loginMsg={this.state.localLoginMsg} />
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

export default Login;