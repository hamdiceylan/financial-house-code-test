import {
    FETCH_CLIENT_REQUEST,
    FETCH_CLIENT_FAILURE,
    FETCH_CLIENT_SUCCESS
  } from '../actions/clients';
  
  export default function clients(
    state = {
      isFetching: false,
    },
    action,
  ) {
    switch (action.type) {
      case FETCH_CLIENT_REQUEST:
        return Object.assign({}, state, {
          isFetching: true,
        });
      case FETCH_CLIENT_FAILURE:
        return Object.assign({}, state, {
          isFetching: false
      }); 
      case FETCH_CLIENT_SUCCESS:
        return Object.assign({}, state, {
          isFetching: true,
          clients: action.clients,
        });
      default:
        return state;
    }
  }
  