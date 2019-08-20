import React, { Component } from "react";
import NavbarCoin from "../components/NavbarCoin";
import Canvas from "../components/canvas";
const axios = require('axios')


class Coin extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        CoinId: "1182"
    }

    handleInput = (event) => {
        const {value} = event.target;
        this.setState({
            CoinId: value,
            History: [],
            Display: false
        })
        console.log(this.state.CoinId)
    }  

    handleCanvas = (event) => {
        event.preventDefault();
        let self = this
        alert("KKKKK");
        axios.get("/api/coins/history/" + this.state.CoinId).then(function(historyData){
            console.log("=======>    ", historyData.data)
            self.setState({
                History: historyData.data,
                Display: true
            })
        })
        
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
                        <li className="nav-item">
                            <input onChange={this.handleInput}></input>
                            <button type="button" onClick={this.handleCanvas}>Details</button>
                        </li> 
                    </ul>
                </NavbarCoin>
                <Canvas
                    display = {this.state.Display}
                    history = {this.state.History}
                />
            </div>
        );
    }
}

export default Coin;