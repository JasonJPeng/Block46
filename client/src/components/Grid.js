import React, {Component} from 'react';
import {Row, Column, Container} from 'react-bootstrap';
import axios from 'axios';

const coins = [
    {id:1, name: 'BitCoin', value: "$10,000", happy: "🤩", qty: 100, fake: false, total: "$1m"  },
    {id:2, name: 'BitCoin', value: "$10,000", happy: "🤩", qty: 100, fake: false, total: "$1m"  },
    {id:3, name: 'BitCoin', value: "$10,000", happy: "🤩", qty: 100, fake: false, total: "$1m"  },
    {id:4, name: 'BitCoin', value: "$10,000", happy: "🤩", qty: 100, fake: false, total: "$1m"  },
]

class Grid extends Component {
    state = {
        data: null,
        error: null
    }

    componentDidMount(){
        axios.get("/yourCryptoAPI/allCoins").then(response => {
            this.setState({data: response.data})
        }).catch(error => {
            if(error) this.setState({error: error.message})
        })
    }
    render(){
        return(
            <div>
                <Container>
                    <Row>
                        <Col>coin</Col>
                        <Col>value</Col>
                        <Col>happy</Col>
                        <Col>qty</Col>
                        <Col>fake</Col>
                        <Col>total</Col>
                    </Row>
                    {coins.map(coin => (
                        <Row key={coin.id}>
                            <Col>{coin.name}</Col>
                            <Col>{coin.value}</Col>
                            <Col>{coin.happy}</Col>
                            <Col>{coin.qty}</Col>
                            <Col>{coin.fake}</Col>
                            <Col>{coin.total}</Col>
                        </Row>
                    ))}
                    </Container>
            </div>
        )
    }
}

export default Grid;