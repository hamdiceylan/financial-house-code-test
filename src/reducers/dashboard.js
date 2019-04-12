import {
    FETCH_TRANSACTION_REQUEST,
    FETCH_TRANSACTION_FAILURE,
    FETCH_TRANSACTION_SUCCESS
  } from '../actions/dashboard';
  
  export default function dashboard(
    state = {
      isFetching: false,
    },
    action,
  ) {
    switch (action.type) {
      case FETCH_TRANSACTION_REQUEST:
        return Object.assign({}, state, {
          isFetching: true,
        });
      case FETCH_TRANSACTION_FAILURE:
        return Object.assign({}, state, {
          isFetching: false
      }); 
      case FETCH_TRANSACTION_SUCCESS:
        return Object.assign({}, state, {
          isFetching: false,
          transactions: action.transactions,
        });
      default:
        return state;
    }
  }
  