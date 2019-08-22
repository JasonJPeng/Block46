import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Canvas from "../components/Canvas";

class Coin extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        searchTerm: "",
        columns: [],
        data: []
    };

    allCoins = [];

    // send request /api/coins via axios
    requestApiCoins() {
        // this
        let self = this;

        // use /api/coins for coin data
        axios.get("/api/coins").then(function (response) {
            // api data from response
            let coinsApiData = response.data;

            // table data conversed from api data
            let coinsTableData = [];
            coinsApiData.forEach(coin => {
                coinsTableData.push(
                    {
                        symbol: coin.Symbol,
                        name: coin.Name,
                        image: coin.ImageUrl
                    }
                )
            });

            // set columns based on /api/coins response data structure
            const coinsColumns = [
                {
                    name: "Coin Image",
                    cell: row => <img src={row.image} width="20px" height="20px"></img>
                },
                {
                    name: "Symbol",
                    selector: "symbol",
                    sortable: true
                },
                {
                    name: "Name",
                    selector: "name",
                    sortable: true
                },
            ];

            self.setState({
                columns: coinsColumns,
                data: coinsTableData
            })

            self.allCoins = coinsTableData; // save for search
        });
    }

    componentDidMount() {
        this.requestApiCoins();
    }

    handleSearchInput = (event) => {
      const {value} = event.target ;
      this.setState({searchTerm: value})
    }

    searchCoin = (event) => {
        event.preventDefault();
        let newTable = [];
        let q = this.state.searchTerm;
        let searchRegEx = new RegExp(q, "i") 
        this.allCoins.forEach(function(e) {
            if (e.symbol.match(searchRegEx)|| e.name.match(searchRegEx)) {
                newTable.push(e);
            }
        })

        this.setState({data: newTable})
        
    }

    render() {
        return (
            <Router>
                <Navbar bg="dark" fixed="top" variant="dark">
                    <Navbar.Brand href="#home">Block46</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Saved</Nav.Link>
                        <Nav.Link><Link to="/digest/">Block Digest</Link></Nav.Link>
                        <Nav.Link><Link to="/canvas/">Block canvas</Link></Nav.Link>
                        <Nav.Link href="/">{this.props.username}</Nav.Link>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormGroup>
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={this.handleSearchInput} />
                            <Button variant="outline-info" onClick={this.searchCoin}>Search</Button>
                        </FormGroup>
                    </Form>
                </Navbar>

                
                <Route path="/" exact component={() => (<DataTable
                    title="Block Digest"
                    columns={this.state.columns}
                    data={this.state.data}
                    style={{ backgroundColor: "white", overflow: "scroll" }}
                    pagination={true}
                    paginationPerPage={10}
                />)} />
                <Route path="/digest/" component={() => ((<DataTable
                    title="Block Digest"
                    columns={this.state.columns}
                    data={this.state.data}
                    style={{ backgroundColor: "white", overflow: "scroll" }}
                    pagination={true}
                    paginationPerPage={10}
                />))} />
                <Route path="/canvas/" component={Canvas} />
            </Router>
        );
    }
}

export default Coin;