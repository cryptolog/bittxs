import React, { Component } from 'react';
import { connect } from 'react-redux';

import Tx from './Tx';

import '../styles/Txs.css';

class Txs extends Component {
  render() {
    return (
      <div id="txs-box" className="address-transactions">
        {this.props.transactions.map(txs => <Tx key={txs.hash} tx={txs} address={this.props.address} />)}
      </div>
    );
  }
}

const mapStateToProps = state => ({ transactions: state.txs });

export default connect(mapStateToProps)(Txs);
