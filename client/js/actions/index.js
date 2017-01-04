import createAPIRequest from '../util/createAPIRequest';

export const REQUEST_FEED = 'REQUEST_FEED';
export const RECEIVED_FEED = 'RECEIVED_FEED';
export const ERROR_FEED = 'ERROR_FEED';

export const SAVE_OPENGRAPH = 'SAVE_OPENGRAPH';
export const SAVE_OPENGRAPH_FAILED = 'SAVE_OPENGRAPH_FAILED';
export const SAVE_OPENGRAPH_SUCCESS = 'SAVE_OPENGRAPH_SUCCESS';

export const POST_GRAPH = 'POST_GRAPH';
export const POST_GRAPH_SUCCESS = 'POST_GRAPH_SUCCESS';
export const POST_GRAPH_FAILED = 'POST_GRAPH_FAILED';
export const POST_GRAPH_RESET = 'POST_GRAPH_RESET';

export const API_FATAL_ERROR = 'API_FATAL_ERROR';

function apiFatalError(error) {
  return {
    type: 'API_FATAL_ERROR',
    error
  };
}

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

export function createOpenGraph(url) {
  return function(dispatch) {
    dispatch(saveOpenGraph(url));

    return fetch(createAPIRequest('POST', '/api/og', {url}))
      .then((response) => response.json())
      .then((json) => {
        if (json.errors) {
          return dispatch(saveOpenGraphFailed(json.errors));
        }
        return dispatch(saveOpenGraphSuccess(json.data));
      })
      .catch((error) => dispatch(apiFatalError(error)));
  };
}

function saveOpenGraph(url) {
  return {
    type: SAVE_OPENGRAPH,
    url: url
  };
}

function saveOpenGraphFailed(errors) {
  return {
    type: SAVE_OPENGRAPH_FAILED,
    errors
  };
}

function saveOpenGraphSuccess(graph) {
  return {
    type: SAVE_OPENGRAPH_SUCCESS,
    graph
  };
}


export function postGraphToFeed(id) {
  return function(dispatch) {
    dispatch(postGraph(id));

    const body = {
      data: {
        open_graph_id: id
      }
    };

    return fetch(createAPIRequest('POST', '/api/feed', body))
      .then((response) => response.json())
      .then((json) => {
        if (json.errors) {
          return dispatch(postGraphFailed(json.errors));
        }
        return dispatch(postGraphSuccess(json.data.feed));
      })
      .catch((error) => dispatch(apiFatalError(error)));
  };
}

function postGraph(id) {
  return {
    type: POST_GRAPH,
    id
  };
}

function postGraphSuccess(feed) {
  return {
    type: POST_GRAPH_SUCCESS,
    feed
  };
}

function postGraphFailed(errors) {
  return {
    type: POST_GRAPH_FAILED,
    errors
  };
}

export function postGraphReset() {
  return function(dispatch) {
    dispatch(resetGraph());
  };
}

function resetGraph() {
  return {
    type: POST_GRAPH_RESET
  };
}
