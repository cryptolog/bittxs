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

const DEFAULT_STATE = {
  address: '',
  addressStatus: '',
  fetchStatus: 'DONE',
  socketStatus: 'CLOSED',
  txs: [],
  txsCount: 0,
  txsInfo: {}
};

const addNewTxs = (state, action) => {
  let newTxs = state.txs.slice();
  newTxs.unshift(action.payload);
  return Object.assign({}, state, { txs: newTxs });
};

const pushMoreTxs = (state, action) => {
  let concatReady = false;
  let lastIndex = state.txs.length - 1;
  while (concatReady === false && action.payload.length > 0) {
    if (action.payload[0] && state.txs[lastIndex] && action.payload[0].hash === state.txs[lastIndex].hash) {
      action.payload.shift();
    } else {
      concatReady = true;
    }
  }
  let newTxs = state.txs.concat(action.payload);
  return Object.assign({}, state, { txs: newTxs });
};

const setAddress = (state, action) => Object.assign({}, state, { address: action.payload });
const setAddressStatus = (state, action) => Object.assign({}, state, { addressStatus: action.payload });
const setFetchStatus = (state, action) => Object.assign({}, state, { fetchStatus: action.payload });
const setSocketStatus = (state, action) => Object.assign({}, state, { socketStatus: action.payload });
const setTransactions = (state, action) => Object.assign({}, state, { txs: action.payload });
const setTxsCount = (state, action) => Object.assign({}, state, { txsCount: action.payload });
const setTxsInfo = (state, action) => Object.assign({}, state, { txsInfo: action.payload });

const updateTxsCount = (state, action) => {
  let newTxsCount = state.txsCount + action.payload;
  return Object.assign({}, state, { txsCount: newTxsCount });
};

const updateTxsInfo = (state, action) => {
  let newTxsInfo = {
    balance: state.txsInfo.balance + action.payload.net,
    sent: state.txsInfo.sent + action.payload.sent,
    received: state.txsInfo.received + action.payload.received,
    numTxs: (state.txsInfo.numTxs += 1)
  };
  return Object.assign({}, state, { txsInfo: newTxsInfo });
};

const rootReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ADDRESS:
      return setAddress(state, action);
    case ADDRESS_STATUS:
      return setAddressStatus(state, action);
    case FETCH_STATUS:
      return setFetchStatus(state, action);
    case MORE_TXS:
      return pushMoreTxs(state, action);
    case NEW_INFO:
      return updateTxsInfo(state, action);
    case NEW_TXS:
      return addNewTxs(state, action);
    case NEW_TXS_COUNT:
      return updateTxsCount(state, action);
    case SOCKET_STATUS:
      return setSocketStatus(state, action);
    case TXS:
      return setTransactions(state, action);
    case TXS_COUNT:
      return setTxsCount(state, action);
    case TXS_INFO:
      return setTxsInfo(state, action);
    default:
      return state;
  }
};

export default rootReducer;
