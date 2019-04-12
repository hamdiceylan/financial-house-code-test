import { combineReducers } from 'redux';
import auth from './auth';
import runtime from './runtime';
import navigation from './navigation';
import transactions from './dashboard';
import clients from './clients';
import transactionDetail from './transactionDetail';

export default combineReducers({
  auth,
  runtime,
  navigation,
  transactions,
  clients,
  transactionDetail
});
