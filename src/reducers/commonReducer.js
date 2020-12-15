const INIT_STATE = {
  authenticate: false,
  token: null,
};

export const commonReducer = (state = INIT_STATE, action) => {

  const payload=action.payload;
  console.log(payload);
  switch (action.type) {
    case "APP_LOAD":
      return {
        ...state,
        token: action.token || null,
        redirectTo: payload ? null : '/login',
        appLoaded: true,
      };

    case "REDIRECT":
      return { ...state, redirectTo: null };
    case "LOGOUT":
      return { ...state, redirectTo: '/login', token: null, currentUser: null };
    case "LOGIN":
      return {
        ...state,
        redirectTo: payload.success ? '/dashboard' : null,
        token: payload.success ? action.payload.data.token : null,
        currentUser: payload.success ? action.payload.data.user : null,
        authentication: payload.success ? (action.payload.data.token.length === 36) : false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        redirectTo: payload ? '/dashboard' : null,
        token: payload ? action.payload : null,
        authentication: payload ? true : false,
      };

    case 'LOGIN_FAILED':
          return {
              ...state,
              redirectTo: null,
              authenticate: false,
              token: null,
              isLoading: false,
              message: action.message ? action.message : null,
          };

    case "UNAUTH":
      return {
        authentication: false,
        redirectTo: '/login',
        token: null, currentUser: null,
      }
    case "REGISTER_PAGE_UNLOADED":
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    default:
      return state;
  }
}

export default commonReducer;
