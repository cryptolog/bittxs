import { store } from './store';

import {
  ADDRESS,
  ADDRESS_STATUS,
  FETCH_STATUS,
  MORE_TXS,
  NEW_INFO,
  NEW_TXS,
  NEW_TXS_COUNT,
  SOCKET_STATUS,
  TXS,
  TXS_COUNT,
  TXS_INFO
} from './actions';

// TODO: Increase socket security and event handling sophistication
function initSocket() {
  let wsSocket;
  if (!wsSocket) {
    wsSocket = new WebSocket('wss://ws.blockchain.info/inv');
    wsSocket.onopen = function(event) {
      store.dispatch(broadcastSocketStatus('OPEN'));
    };
    wsSocket.onmessage = function(event) {
      let txsData = JSON.parse(event.data);
      let currentState = store.getState();
      store.dispatch(handleNewTxs(txsData.x, currentState.address));
    };
  }

  function getSocket() {
    return wsSocket;
  }

  return {
    getSocket
  };
}

const socket = initSocket();

// ACTION CREATORS
export function broadcastAddress(address) {
  return { type: ADDRESS, payload: address };
}

export function broadcastAddressStatus(status) {
  return { type: ADDRESS_STATUS, payload: status };
}

export function broadcastFetchStatus(status) {
  return { type: FETCH_STATUS, payload: status };
}

export function broadcastMoreTxs(txs) {
  return { type: MORE_TXS, payload: txs };
}

export function broadcastNewInfo(txInfo) {
  return { type: NEW_INFO, payload: txInfo };
}

export function broadcastNewTxs(txs) {
  return { type: NEW_TXS, payload: txs };
}

export function broadcastSocketStatus(status) {
  return { type: SOCKET_STATUS, payload: status };
}

export function broadcastTxs(txs) {
  return { type: TXS, payload: txs };
}

export function broadcastTxsCount(count) {
  return { type: TXS_COUNT, payload: count };
}

export function broadcastTxsCountUpdate(count) {
  return { type: NEW_TXS_COUNT, payload: count };
}

export function broadcastTxsInfo(info) {
  return { type: TXS_INFO, payload: info };
}

export function setTxsInfo(info) {
  return dispatch => {
    dispatch(broadcastTxsInfo(info));
  };
}

// DISPATCH LOGIC
export function calcNewInfo(tx, address) {
  let txInfo = {
    received: 0,
    sent: 0,
    net: 0
  };
  if (tx.out && tx.out.length > 0) {
    tx.out.forEach(recipient => {
      if (recipient.addr === address) {
        txInfo.received += recipient.value;
      }
    });
  }
  if (tx.inputs && tx.inputs.length > 0) {
    tx.inputs.forEach(sender => {
      if (sender.prev_out.addr === address) {
        txInfo.sent += sender.prev_out.value;
      }
    });
  }
  txInfo.net = txInfo.received - txInfo.sent;
  return dispatch => {
    dispatch(broadcastNewInfo(txInfo));
  };
}

export function getAddressData(address, priorAddress, socketStatus) {
  return dispatch => {
    fetch(`https://blockchain.info/rawaddr/${address}?cors=false`)
      .then(result => result.text())
      .then(data => {
        let addressData = JSON.parse(data);
        dispatch(setTxs(addressData));
        handleSubs(address, priorAddress);
        dispatch(broadcastAddressStatus('OK'));
      })
      .catch(err => {
        console.log('I am the fetch error', err);
        handleSubs(address, priorAddress, err);
        dispatch(broadcastAddressStatus('ERROR'));
      });
    dispatch(broadcastAddress(address));
  };
}

export function getMoreTxs(address, offset) {
  return dispatch => {
    dispatch(broadcastFetchStatus('FETCHING'));
    fetch(`https://blockchain.info/rawaddr/${address}?cors=false&offset=${offset}`)
      .then(result => result.text())
      .then(data => {
        let addressData = JSON.parse(data);
        if (addressData.txs.length > 0) {
          dispatch(broadcastMoreTxs(addressData.txs));
          dispatch(broadcastTxsCountUpdate(addressData.txs.length));
          dispatch(broadcastFetchStatus('DONE'));
        }
      });
  };
}

export function handleNewTxs(txs, address) {
  return dispatch => {
    dispatch(broadcastNewTxs(txs));
    dispatch(calcNewInfo(txs, address));
    dispatch(broadcastTxsCountUpdate(1));
  };
}

export function handleSubs(address, priorAddress, error) {
  let openSocket = socket.getSocket();
  unsubFromAddress(priorAddress, openSocket);
  if (!error) {
    subscribeToAddress(address, openSocket);
  }
}

export function subscribeToAddress(address, socket) {
  let msg = {
    op: 'addr_sub',
    addr: address
  };
  socket.send(JSON.stringify(msg));
}

export function setTxs(data) {
  return dispatch => {
    dispatch(
      setTxsInfo({
        balance: data.final_balance,
        sent: data.total_sent,
        received: data.total_received,
        numTxs: data.n_tx
      })
    );
    dispatch(broadcastTxs(data.txs));
    dispatch(broadcastTxsCount(data.txs.length));
  };
}

export function unsubFromAddress(address, socket) {
  if (address) {
    let msg = {
      op: 'addr_unsub',
      addr: address
    };
    socket.send(JSON.stringify(msg));
  }
}
