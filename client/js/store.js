import { compose, applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';

const env = process.env.NODE_ENV;

const middleware = [
  thunkMiddleware,
  env !== 'production' ? createLogger() : undefined
].filter((v) => !!v);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducers,
  composeEnhancers(
    applyMiddleware(...middleware)
  )
);

export default store;
