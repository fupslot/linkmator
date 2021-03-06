import { combineReducers } from 'redux';
import {
  REQUEST_POSTS,
  RECEIVED_POSTS,
  ERROR_POSTS,

  SAVE_OPENGRAPH,
  SAVE_OPENGRAPH_FAILED,
  SAVE_OPENGRAPH_SUCCESS,

  POST_GRAPH,
  POST_GRAPH_SUCCESS,
  POST_GRAPH_FAILED,
  POST_GRAPH_RESET,

  API_FATAL_ERROR
} from '../actions';


const feedState = {
  person: null,
  items: [],
  isFetching: false
};

function feed(state = feedState, action) {
  switch (action.type) {
    case REQUEST_POSTS:
      return Object.assign(
        {},
        state,
        {
          isFetching: true
        }
      );

    case RECEIVED_POSTS:
      return Object.assign(
        {},
        state,
        {
          isFetching: false,
          person: action.person,
          posts: [...action.posts]
        }
      );

    case ERROR_POSTS:
      return Object.assign(
        {},
        state,
        {
          isFetching: false
        }
      );

    case POST_GRAPH_SUCCESS:
      return Object.assign(
        {},
        state, {
          posts: [action.post, ...state.posts]
        }
      );

    default:
      return state;
  }
}

const linkmatorState = {
  url: '',
  graph: null,
  isSaving: false,
  errors: null
};

function linkmator(state = linkmatorState, action) {
  switch (action.type) {
    case SAVE_OPENGRAPH:
      return Object.assign({}, linkmatorState, {
        url: action.url,
        isSaving: true
      });

    case SAVE_OPENGRAPH_SUCCESS:
      return Object.assign({}, state, {
        graph: action.graph,
        isSaving: false
      });

    case SAVE_OPENGRAPH_FAILED:
      return Object.assign({}, state, {
        isSaving: false,
        errors: action.errors
      });

    case POST_GRAPH:
      return Object.assign({}, state, {
        isSaving: true,
      });

    case POST_GRAPH_RESET:
    case POST_GRAPH_SUCCESS:
      return Object.assign({}, linkmatorState);

    case POST_GRAPH_FAILED:
      return Object.assign({}, state, {
        isSaving: false,
        errors: action.errors,
      });

    case API_FATAL_ERROR:
      if (!state.isSaving) {
        return state;
      }

      return Object.assign({}, state, {
        isSaving: false
      });
    default:
      return state;
  }
}

export default combineReducers({
  feed,
  linkmator
});
