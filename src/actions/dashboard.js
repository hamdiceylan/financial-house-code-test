export const FETCH_TRANSACTION_REQUEST = 'FETCH_TRANSACTION_REQUEST';
export const FETCH_TRANSACTION_FAILURE = 'FETCH_TRANSACTION_FAILURE';
export const FETCH_TRANSACTION_SUCCESS = 'FETCH_TRANSACTION_SUCCESS';

function requestFetchTransaction(){
    return {
        type: FETCH_TRANSACTION_REQUEST,
        isFetching: true,
    };
}

function fetchTransactionError(message){
    return {
        type: FETCH_TRANSACTION_FAILURE,
        isFetching: false,
        message,
    };
}

function fetchTransactionRequestSuccess(transactions) {
    return {
      type: FETCH_TRANSACTION_SUCCESS,
      isFetching: false,
      transactions : transactions
    };
  }

export function fetchTransactions(){

    const config = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem('access_token')
      },
      body: JSON.stringify({fromDate: "2011-07-01",toDate: "2019-08-01"})
    };
  
    return dispatch => {
      dispatch(requestFetchTransaction());
  
      return fetch('/api/v3/transaction/list', config)
        .then(response =>
          response.json().then(responseJson => ({
            transactions: JSON.parse(responseJson)
          })),
        )
        .then(({ transactions }) => {
          dispatch(fetchTransactionRequestSuccess(transactions.data));
          return Promise.resolve(transactions);
        })
        .catch(err => console.error('Error: ', err));
    };
}