

const INIT_STATE = {
    app: [],
    currentUser:[]
  };

export const authReducer = (state = {}, action) => {
    switch (action.type) {
        case 'START_LOGIN':

        // case 'LOGIN_SUCCESS':
        //     return {
        //         ...state, isLoading: false, success: action.success
        //     }
        case 'START_GET_CURRENT_USER':
            return {
                ...state, isLoading: false, success: action.success
            }

        case 'GET_CURRENT_USER_SUCCESS':
            return {
                ...state, isLoading: false, success: action.success, currentUser: action.currentUser
            }

        case 'LOGIN_UNLOAD': {
            return {}
        }

        case 'ASYNC_START': {
            return {
                ...state, success: null, isLoading: true
            }
        }

        default:
            return state;
    }
}

export default authReducer;
