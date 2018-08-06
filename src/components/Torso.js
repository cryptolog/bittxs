import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getMoreTxs } from '../utils/actionCreators';
import Meta from './Meta';
import Txs from './Txs';

import '../styles/Torso.css';

class Torso extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.throttle(this.handleScroll, 300));
  }

  // TODO: Design more sophisticated scroll behavior
  handleScroll(e) {
    let elem = document.getElementById('txs-box');
    if (elem.clientHeight / window.scrollY < 2 && this.props.fetchStatus === 'DONE') {
      this.props.moreTxs(this.props.address, this.props.txsCount);
      this.setState({ fetching: 'FETCHING' });
    }
  }
  throttle(fn, delay) {
    let time = Date.now();
    return function() {
      if (time + delay - Date.now() < 0) {
        fn();
        time = Date.now();
      }
    };
  }

  // TODO: Add spinner component to render while fetching
  render() {
    let metaRow = <div />;
    let txsRow = <div />;
    let addressTitle = <div />;
    if (this.props.addressStatus === 'OK') {
      metaRow = <Meta />;
      txsRow = <Txs address={this.props.address} />;
    } else if (this.props.addressStatus === 'ERROR') {
      metaRow = (
        <div className="address-error">
          Hmmm. That didn't work. Double check the bitcoin address or try a different one.
        </div>
      );
    }
    if (this.props.address) {
      addressTitle = <div className="address-title"> bitcoin address: </div>;
    }
    return (
      <div className="torso-body">
        <div className="address-box">
          {addressTitle}
          <div className="address-address"> {this.props.address} </div>
        </div>
        {metaRow}
        {txsRow}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  address: state.address,
  addressStatus: state.addressStatus,
  fetchStatus: state.fetchStatus,
  txsCount: state.txsCount
});
const mapDispatchToProps = (dispatch: Function) => ({
  moreTxs(address, offset) {
    dispatch(getMoreTxs(address, offset));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Torso);
