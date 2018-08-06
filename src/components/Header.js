import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getAddressData } from '../utils/actionCreators';

import '../styles/Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ address: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.setAddress(this.state.address, this.props.address);
    this.setState({ address: '' });
  }

  render() {
    return (
      <header className="app-header between middle">
        <div className="app-name">BITTXS</div>
        <div className="address-search">
          <form onSubmit={this.handleSubmit}>
            <input
              placeholder="Input Bitcoin Address"
              className="address-input"
              type="text"
              value={this.state.address}
              onChange={this.handleChange}
            />
          </form>
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({ address: state.address });
const mapDispatchToProps = (dispatch: Function) => ({
  setAddress(address, priorAddress) {
    dispatch(getAddressData(address, priorAddress));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
