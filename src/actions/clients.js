export const FETCH_CLIENT_REQUEST = 'FETCH_CLIENT_REQUEST';
export const FETCH_CLIENT_SUCCESS = 'FETCH_CLIENT_SUCCESS';
export const FETCH_CLIENT_FAILURE = 'FETCH_CLIENT_FAILURE';

function requestFetchClient() {
  return {
    type: FETCH_CLIENT_REQUEST,
    isFetching: true,
  };
}

function requestFetchClientFailure() {
  return {
    type: FETCH_CLIENT_FAILURE,
    isFetching: true,
  };
}

function fetchClientRequestSuccess(clients) {
  return {
    type: FETCH_CLIENT_SUCCESS,
    isFetching: false,
    clients
  };
}

export function getClients(transactionId){

  const config = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `${localStorage.getItem('access_token')}`
    },
    body: JSON.stringify({transactionId:transactionId})

  };

  return dispatch => {
    dispatch(requestFetchClient());

    return fetch('/api/v3/client', config)
      .then(response =>
        response.json().then(responseJson => ({
          clients: JSON.parse(responseJson),
        })),
      )
      .then(({ clients }) => {
        if (!clients) {
          dispatch(fetchPostsError(clients));
          return Promise.reject(clients);
        }
        dispatch(fetchClientRequestSuccess(clients));
        return Promise.resolve(clients);
      })
      .catch(err => console.error('Error: ', err));
  };
}
