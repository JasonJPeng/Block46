import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import FormGroup from "react-bootstrap/FormGroup";
import Button from "react-bootstrap/Button";
import Canvas from "../components/Canvas";

class Coin extends Component {

    state = {
        searchTerm: "",
        columns: [],
        data: [],
        selectedIds: [],
        toggledClearRows: false,
        searchMode: true,
        componentShow: "datatable",
        tableName: "Block Digest"
    };

    allCoins = [];

    // Add selected roows data[i] in state.selectedIds
    updateState = state => {
        this.setState({ selectedIds: state.selectedRows.map(x => x.id) });
        // console.log(this.state.selectedIds)
    }
// !! logout route should send something to the client
    logOut = async () => {
        await axios.get("/logout").then(response => {
            //  do something with the message or the response?
            alert("You have successfully logged out");
        })
        document.location.href = "/";
    }

    displaySavedCoins = (event) => {
        event.preventDefault();
        this.setState({ searchMode: false })
        let userId = this.props.username;
        let self = this
        axios.get("/api/coins/" + userId + "/view").then(function (selected) {
            console.log(selected.data)
            // let myCoins = self.allCoins.filter(x=> selected.indexOf(x.id)>=0)
            // let myCoins = selected.data.map(x=>{return self.allCoins.find(y=>y.id===x)})
            let myCoins = [];
            selected.data.forEach(function (e) {
                let coin = self.allCoins.find(x => x.id === e);
                coin ? myCoins.push(coin) : console.log(e + " is not a valid ID");
            })

            self.setState({ data: myCoins })
        }).then(function () {
            self.setState({ componentShow: "datatable", tableName : "Saved Blocks" })
        })
    }

    displayApiCoins = (event) => {
        event.preventDefault();
        this.setState({ searchMode: true })
        this.setState({data : this.allCoins, componentShow: "datatable", tableName : "Block Digest" });
    }

    displayCanvas = (event) => {
        event.preventDefault();
        this.setState({ searchMode: true })
        this.setState({ componentShow: "canvas" });
    }

    addCoin = (event) => {
        event.preventDefault();
        console.log("Adding   => ", this.state.selectedIds)
        let userId = this.props.username
        this.setState({ toggledClearRows: !this.state.toggledClearRows })
        // ToDo axios /api/coins/userId/add?coinIds=...this.state.selectedIds
        //      
        if (this.state.selectedIds.length > 0) {
            let self = this;
            axios.put("/api/coins/" +
                userId + "/add?coinIds=" +
                self.state.selectedIds.reduce((a, b) => a + ',' + b))
                .then(function (res) {
                    console.log("added", self.state.selectedIds)
                    self.setState({ selectedIds: [] })
                })

        }
    }

    removeCoin = (event) => {
        event.preventDefault();
        let userId = this.props.username
        console.log("Removing ==>  ", this.state.selectedIds)
        let newCoins = this.state.data.filter(x => this.state.selectedIds.indexOf(x.id) < 0);
        this.setState({ data: newCoins, selectedIds: [] })
        this.setState({ toggledClearRows: !this.state.toggledClearRows })
        //ToDo axios /api/cooinc/userId/remove"coinIds=...this.state.selectedIds
        let self = this;
        axios.put("/api/coins/" +
            userId + "/remove?coinIds=" +
            self.state.selectedIds.reduce((a, b) => a + ',' + b))
            .then(function (res) {
                console.log("removed ", self.state.selectedIds)
                self.setState({ selectedIds: [] })
            })
    }

    // componentDidMount() {
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
                        id: coin.Id,
                        symbol: coin.Symbol,
                        name: coin.Name,
                        image: coin.ImageUrl
                    }
                )
            });

            // set columns based on /api/coins response data structure
            const coinsColumns = [
                {
                    name: "Select All",
                    cell: row => <img src={row.image} alt="select all" width="50px" height="50px"></img>
                },
                {
                    name: "Coin Symbol",
                    selector: "symbol",
                    sortable: true
                },
                {
                    name: "Name",
                    selector: "name",
                    sortable: true
                }
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
        const { value } = event.target;
        this.setState({ searchTerm: value })
    }

    searchCoin = (event) => {
        event.preventDefault();
        let newTable = [];
        let q = this.state.searchTerm;
        let searchRegEx = new RegExp(q, "i")
        this.allCoins.forEach(function (e) {
            if (e.symbol.match(searchRegEx) || e.name.match(searchRegEx)) {
                newTable.push(e);
            }
        })

        this.setState({
            data: newTable,
            searchMode: true
        })

    }
    // ToDO adding "saved" to display axios /api/coins/userId/view  

    render() {
        let child;
        if ("datatable" === this.state.componentShow) {
            child = (
                <DataTable
                    title={this.state.tableName}
                    columns={this.state.columns}
                    data={this.state.data}
                    style={{ backgroundColor: "white", overflow: "scroll" }}
                    pagination={true}
                    paginationPerPage={15}
                    selectableRows
                    onRowSelected={this.updateState}
                    clearSelectedRows={this.state.toggledClearRows}
                />
            );
        } else if ("canvas" === this.state.componentShow) {
            child = (
                <Canvas Ids={this.state.selectedIds} />
            );
        } else {
            child = (
                <div></div>
            );
        }

        return (
            <div>
                <Navbar bg="dark" fixed="top" variant="dark">
                    <Navbar.Brand href="#home">Block46</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link onClick={this.displaySavedCoins}>
                            My Coins
                        </Nav.Link>
                        <Nav.Link onClick={this.displayApiCoins}>
                            All Coins
                        </Nav.Link>
                        <Nav.Link onClick={this.displayCanvas}>
                            Graphs &amp; News
                        </Nav.Link>
                        
                        {this.state.searchMode ?
                                <Nav.Link variant="outline-info" onClick={this.addCoin}>Add Coins</Nav.Link> :
                                <Nav.Link variant="outline-info" onClick={this.removeCoin}>Remove Coins</Nav.Link>
                        } 
                    
                        <Nav.Link href="/">{this.props.username}</Nav.Link>
                        <Nav.Link  onClick={this.logOut} href="/logout">Logout</Nav.Link>
                    </Nav>
                    <Form inline>
                        <FormGroup>
                            {/* {this.state.searchMode ?
                                <Button variant="outline-info" onClick={this.addCoin}>Add</Button> :
                                <Button variant="outline-info" onClick={this.removeCoin}>Remove</Button>
                            } */}
                            <FormControl type="text" placeholder="Search" className="mr-sm-2" onChange={this.handleSearchInput} />

                            <Button variant="outline-info" onClick={this.searchCoin}>Search</Button>
                        </FormGroup>
                    </Form>
                </Navbar>

                {child}
            </div>
        );
    }
}

export default Coin;