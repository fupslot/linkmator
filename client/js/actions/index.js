import createAPIRequest from '../util/createAPIRequest';

export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVED_POSTS = 'RECEIVED_POSTS';
export const ERROR_POSTS = 'ERROR_POSTS';

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

export function fetchPosts() {
  return function(dispatch) {
    dispatch(requestPosts());

    const headers = new Headers({
      'Accept': 'application/json'
    });

    const request = new Request(
      '/api/posts',
      {
        method: 'GET',
        headers,
        mode: 'same-origin',
        credentials: 'same-origin'
      }
    );


    return fetch(request)
      .then((response) => response.json())
      .then((json) => dispatch(receivedPosts(json)))
      .catch((error) => dispatch(errorPosts(error)));
  };
}

function requestPosts() {
  return {
    type: REQUEST_POSTS
  };
}

function receivedPosts(json) {
  return {
    type: RECEIVED_POSTS,
    person: json.data.person,
    posts: json.data.posts
  };
}

function errorPosts(error) {
  return {
    type: ERROR_POSTS,
    message: error && error.message
  };
}

export function createOpenGraph(url) {
  return function(dispatch) {
    dispatch(saveOpenGraph(url));

    return fetch(createAPIRequest('POST', '/api/graph', {url}))
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
      graphId: id
    };

    return fetch(createAPIRequest('POST', '/api/posts', body))
      .then((response) => response.json())
      .then((json) => {
        if (json.errors) {
          return dispatch(postGraphFailed(json.errors));
        }
        return dispatch(postGraphSuccess(json.data.post));
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

function postGraphSuccess(post) {
  return {
    type: POST_GRAPH_SUCCESS,
    post
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
