import React, { Component } from 'react';

import { connect } from 'react-redux';

import '../styles/Meta.css';

class Meta extends Component {
  addCommas(val) {
    let right = val.slice(-3);
    let left = val.slice(0, -3);
    if (left.length > 3) {
      return `${this.addCommas(left)},${right}`;
    } else {
      return `${left},${right}`;
    }
  }
  addZerosToSatoshiVal(string, zeros) {
    while (zeros > 0) {
      string = `0${string}`;
      zeros -= 1;
    }
    return string;
  }
  createBTCString(string) {
    if (string.length < 9) {
      let diff = 9 - string.length;
      string = this.addZerosToSatoshiVal(string, diff);
    }
    let right = string.slice(-8);
    let left = string.slice(0, -8);
    if (left.length > 3) {
      left = this.addCommas(left);
    }
    return {
      left,
      right
    };
  }
  render() {
    let balance = this.createBTCString(this.props.info.balance.toString());
    let sent = this.createBTCString(this.props.info.sent.toString());
    let received = this.createBTCString(this.props.info.received.toString());
    let numTxs = this.props.info.numTxs.toString();
    if (numTxs.length > 3) {
      numTxs = this.addCommas(numTxs);
    }
    return (
      <div className="address-title-row">
        <div className="address-meta">
          <div className="meta-title"> BTC Balance: </div>
          <div className="meta-data">
            {balance.left}
            <span className="decimal">.{balance.right} </span>
          </div>
        </div>
        <div className="address-meta">
          <div className="meta-title"> Total BTC Sent: </div>
          <div className="meta-data">
            {sent.left}
            <span className="decimal">.{sent.right} </span>
          </div>
        </div>
        <div className="address-meta">
          <div className="meta-title"> Total BTC Received: </div>
          <div className="meta-data">
            {received.left}
            <span className="decimal">.{received.right} </span>
          </div>
        </div>
        <div className="address-meta">
          <div className="meta-title"> Number of Txs: </div>
          <div className="meta-data"> {numTxs} </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({ info: state.txsInfo });

export default connect(mapStateToProps)(Meta);
