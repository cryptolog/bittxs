import React from 'react';
import moment from 'moment';

import '../styles/Tx.css';

const Tx = props => {
  // console.log(props);
  const { inputs, out, hash, time } = props.tx;
  let timeStamp = moment.unix(time).format('ddd MMM Do YYYY kk:mm:ss');
  let received = 0;
  let sent = 0;
  let net = 0;
  let netElem;
  if (out && out.length > 0) {
    out.forEach(recipient => {
      if (recipient.addr === props.address) {
        received += recipient.value;
      }
    });
  }
  if (inputs && inputs.length > 0) {
    inputs.forEach(sender => {
      if (sender.prev_out.addr === props.address) {
        sent += sender.prev_out.value;
      }
    });
  }
  net = (received - sent) * 0.00000001;
  if (net < 0) {
    netElem = <div className="txs-info-data net-negative"> {net}</div>;
  } else {
    netElem = <div className="txs-info-data net-positive"> {net}</div>;
  }
  return (
    <div className="address-transaction">
      <div className="txs-info-box txs-time-box">
        <div className="txs-info-title"> timestamp </div>
        <div className="txs-info-data"> {timeStamp} </div>
      </div>
      <div className="txs-info-box txs-net-box middle">
        <div className="txs-info-title"> net BTC change </div>
        {netElem}
      </div>
      <div className="txs-info-box txs-hash-box">
        <div className="txs-info-title"> txs hash </div>
        <div className="txs-info-data txs-hash-data">{hash}</div>
      </div>
    </div>
  );
};

export default Tx;
