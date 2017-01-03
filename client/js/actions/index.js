export const REQUEST_FEED = 'REQUEST_FEED';
export const RECEIVED_FEED = 'RECEIVED_FEED';
export const ERROR_FEED = 'ERROR_FEED';

export function fetchFeed() {
  return function(dispatch) {
    dispatch(requestFeed());

    const headers = new Headers({
      'Accept': 'application/json'
    });

    const request = new Request(
      '/api/feed',
      {
        method: 'GET',
        headers,
        mode: 'same-origin',
        credentials: 'same-origin'
      }
    );


    return fetch(request)
      .then((response) => response.json())
      .then((json) => dispatch(receivedFeed(json)))
      .catch((error) => dispatch(errorFeed(error)));
  };
}

function requestFeed() {
  return {
    type: REQUEST_FEED
  };
}

function receivedFeed(json) {
  return {
    type: RECEIVED_FEED,
    person: json.data.person,
    items: json.data.feed
  };
}

function errorFeed(error) {
  return {
    type: ERROR_FEED,
    message: error && error.message
  };
}
