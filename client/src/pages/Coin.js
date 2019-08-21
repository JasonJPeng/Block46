import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

class Coin extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        columns: [],
        data: []
    };

    componentDidMount() {
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
                        source: coin.Source,
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
                {
                    name: "Source",
                    selector: "source",
                    sortable: false,
                    right: true
                }
            ];

            self.setState({
                columns: coinsColumns,
                data: coinsTableData
            })

        })
    }

    render() {
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand href="#home">Block46</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">Saved</Nav.Link>
                        <Nav.Link href="/">{this.props.username}</Nav.Link>
                        <Nav.Link href="/logout">Logout</Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                        <Button variant="outline-info">Search</Button>
                    </Form>
                </Navbar>
                
                <DataTable
                    title="Block Digest"
                    columns={this.state.columns}
                    data={this.state.data}
                    style={{ backgroundColor: "white", overflow: "scroll" }}
                    pagination={true}
                    paginationPerPage={10}
                />
            </div>
        );
    }
}

export default Coin;