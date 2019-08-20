import React, { Component } from "react";
import NavbarCoin from "../components/NavbarCoin";


class Coin extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavbarCoin>
                    <a className="navbar-brand" href="/">Block46</a>
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={this.onClickSearch}>Search</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={this.onClickSave}>Saved</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#" onClick={this.onClickSave}>{this.props.username}</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/logout">Log Out</a>
                        </li>
                    </ul>
                </NavbarCoin>
            </div>
        );
    }
}

export default Coin;