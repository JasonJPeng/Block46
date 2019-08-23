import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Modal from './Modal';
// import Coin from "./Coin";
import Sign from "./Sign";

class Home extends Component {
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

    render() {
        return (
            <div className="App">
                <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    <div className="App_test">
                        <Modal onSubmitSignIn={this.handleSignInSubmit}
                            onSubmitSignUp={this.handleSignUpSubmit}
                            onChangeForm={this.handleChangeForm}
                            signupMsg={this.state.signupMsg}
                            loginMsg={this.state.loginMsg} />
                    </div>
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

export default Home;