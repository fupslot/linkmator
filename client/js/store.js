import { compose, applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';


const store = createStore(
  reducers,
  compose(
    applyMiddleware(
      thunkMiddleware,
      createLogger()
    ),
    process.env.NODE_ENV !== 'production'
      ? (window.devToolsExtension && window.devToolsExtension())
      : undefined
  )
);

export default store;
