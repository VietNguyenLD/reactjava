import agent from './agent';
import {
  ASYNC_START, ASYNC_END,LOGIN,
  LOGOUT, REGISTER, HAS_ERROR, SHOW_ERROR, UNAUTH,
} from './actions/actionTypes';

import { TOKEN } from './constants/AppConst';

const _act_reg = new RegExp(/_SUBMIT|_APPROVE|_REJECT|_CANCEL|_CREATE|_DELETE|_RESET_PASSWORD|LOGIN|REGISTER|ADD_ACTION/);

const promiseMiddleware = store => next => action => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const currentView = store.getState().viewChangeCounter;
    const skipTracking = action.skipTracking;

    action.payload.then(
      res => {
        console.log('RESUTLT', res);

        const currentState = store.getState()
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        
        action.messageType = 'success';
        if(res.length > 1) {
          if(res[0].success === false) {
            action.message = res[0].message.map(ele => ele.msg).join('\n');
            action.messageType = 'error';
          } else action.message = res.message || 'successfully';
        } else {
          if (res && res.success === false) {
            action.message = res.message.map(ele => ele.msg).join('\n');
            action.messageType = 'error';
          } else action.message = res.message || 'successfully';
        }
        
        action.payload = res;
        store.dispatch({ type: ASYNC_END, promise: action.payload });
        store.dispatch(action);
      },
      error => {
        const currentState = store.getState();
        if (!skipTracking && currentState.viewChangeCounter !== currentView) {
          return
        }
        
        console.log('ERROR', error);

        action.message = error.message;
        action.messageType = 'error';
        if (!action.skipTracking) {
          store.dispatch({ type: ASYNC_END, promise: action.payload });
        }
        store.dispatch(action);
      }
    );

    return;
  }

  next(action);
};

const localStorageMiddleware = store => next => action => {
  if (action.messageType === 'success' && (action.type === REGISTER || action.type === LOGIN)) {
    const _token = action.payload.data.token;
    if (_token) {
      window.localStorage.setItem(TOKEN, _token);
      agent.setToken(_token);
    }
  } else if ([LOGOUT, UNAUTH].includes(action.type)) {
    window.localStorage.removeItem(TOKEN);
    agent.setToken(null);
  }

  next(action);
};

const showMessageMiddleware = store => next => action => {
  if (!isPromise(action.payload)) {
    if (action.type.match(_act_reg)) {
      store.dispatch({ type: SHOW_ERROR, message: action.message, messageType:action.messageType });
      store.dispatch({ type: HAS_ERROR });
    }
    if (action.payload && [403, 404].includes(action.payload.code)) {
      store.dispatch({ type: UNAUTH });
    }
  }
  
  next(action);
};

function isPromise(v) {
  return v && typeof v.then === 'function';
}

export { promiseMiddleware, localStorageMiddleware, showMessageMiddleware }
