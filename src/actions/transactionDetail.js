export const FETCH_TRANSACTION_DETAIL_REQUEST = 'FETCH_TRANSACTION_DETAIL_REQUEST';
export const FETCH_TRANSACTION_DETAIL_SUCCESS = 'FETCH_TRANSACTION_DETAIL_SUCCESS';
export const FETCH_TRANSACTION_DETAIL_FAILURE = 'FETCH_TRANSACTION_DETAIL_FAILURE';

function requestFetchTransactionDetail() {
  return {
    type: FETCH_TRANSACTION_DETAIL_REQUEST,
    isFetching: true,
  };
}

function requestFetchTransactionDetailFailure() {
  return {
    type: FETCH_TRANSACTION_DETAIL_FAILURE,
    isFetching: true,
  };
}

function fetchTransactionDetailRequestSuccess(transactionDetail) {
  return {
    type: FETCH_TRANSACTION_DETAIL_SUCCESS,
    isFetching: false,
    transactionDetail
  };
}

export function getTransactionDetail(transactionId){
  const config = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `${localStorage.getItem('access_token')}`
    },
    body: JSON.stringify({transactionId:transactionId})
  };

  return dispatch => {
    dispatch(requestFetchTransactionDetail());

    return fetch('/api/v3/transaction', config)
      .then(response =>
        response.json().then(responseJson => ({
          transactionDetail: JSON.parse(responseJson),
        })),
      )
      .then(({ transactionDetail }) => {
        if (!transactionDetail) {
          dispatch(fetchPostsError(transactionDetail));
          return Promise.reject(transactionDetail);
        }
        dispatch(fetchTransactionDetailRequestSuccess(transactionDetail));
        return Promise.resolve(transactionDetail);
      })
      .catch(err => console.error('Error: ', err));
  };
}
