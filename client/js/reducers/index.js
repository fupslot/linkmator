import { combineReducers } from 'redux';
import {
  REQUEST_FEED,
  RECEIVED_FEED,
  ERROR_FEED
} from '../actions';


const feedState = {
  person: null,
  items: [],
  isFetching: false
};

function feed(state = feedState, action) {
  switch (action.type) {
    case REQUEST_FEED:
      return Object.assign(
        {},
        state,
        {
          isFetching: true
        }
      );

    case RECEIVED_FEED:
      return Object.assign(
        {},
        state,
        {
          isFetching: false,
          person: action.person,
          items: [...action.items]
        }
      );

    case ERROR_FEED:
      return Object.assign(
        {},
        state,
        {
          isFetching: false
        }
      );

    default:
      return state;
  }
}

export default combineReducers({
  feed
});
