import {
    FETCH_TRANSACTION_DETAIL_REQUEST,
    FETCH_TRANSACTION_DETAIL_FAILURE,
    FETCH_TRANSACTION_DETAIL_SUCCESS
  } from '../actions/transactionDetail';
  
  export default function transactionDetail(
    state = {
      isFetching: false,
    },
    action,
  ) {
    switch (action.type) {
      case FETCH_TRANSACTION_DETAIL_REQUEST:
        return Object.assign({}, state, {
          isFetching: true,
        });
      case FETCH_TRANSACTION_DETAIL_FAILURE:
        return Object.assign({}, state, {
          isFetching: false
      }); 
      case FETCH_TRANSACTION_DETAIL_SUCCESS:
        return Object.assign({}, state, {
          isFetching: true,
          transactionDetail: action.transactionDetail,
        });
      default:
        return state;
    }
  }
  