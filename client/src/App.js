import React, { Component } from 'react';
import Coin from "./pages/Coin";
import Login from "./pages/Login";
import {
	BrowserRouter as Router,
	Route,
	// Link,
	Redirect,
	// withRouter
} from "react-router-dom";

import Auth from "./util/Auth";

// Private route
const PrivateRoute = ({ component: Component, ...rest }) => (
	<Route {...rest} render={(props) => (
		Auth.authResult.authenticated ? <Component {...props} /> :
			<Redirect to={{
				pathname: "/login",
				state: { from: props.location }
			}} />
	)} />
)

class App extends Component {
	render() {
		console.log(Auth.authResult);
		return (
			<Router>
				<Route path="/login" component={Login} />
				<PrivateRoute exact path="/" component={() => (
					<Coin username={Auth.authResult.loggedinUser} />
				)} />
			</Router>
		);
	}
}

export default App;
