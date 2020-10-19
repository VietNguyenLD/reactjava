
import { createBrowserHistory } from 'history';
// import createHistory from 'history/createBrowserHistory'
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import { localStorageMiddleware, promiseMiddleware, showMessageMiddleware } from './middleware';

// export const history = createHistory()
export const history = createBrowserHistory()
// console.log('history',history);

const getMiddleware = () => {
  console.log(process.env);
  console.log(history);
  if (process.env.NODE_ENV === 'production') {
      return applyMiddleware(routerMiddleware(history), promiseMiddleware, localStorageMiddleware, showMessageMiddleware, thunk);
  } else {
    // Enable additional logging in non-production environments.
    return applyMiddleware(routerMiddleware(history), promiseMiddleware, localStorageMiddleware, showMessageMiddleware,thunk, createLogger())
  }
};

export default function configureStore(preloadedState) {
  console.log(history);
    // const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const composeEnhancer = compose;
    const store = createStore(
        createRootReducer(history),
        preloadedState,
        composeEnhancer(getMiddleware()),
    )

    // // Hot reloading
    // if (module.hot) {
    //     // Enable Webpack hot module replacement for reducers
    //     module.hot.accept('./reducers', () => {
    //         store.replaceReducer(createRootReducer(history));
    //     });
    // }

    return store
}

export const store = configureStore(/* */);