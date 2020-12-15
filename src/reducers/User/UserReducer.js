const INIT_STATE = {
  app: [],
  success: null,
  message: '',
  isLoading: false,
  dataUpdate: [],
  dataCreate: [],
  dataList:[],
  dataDetail:[],
};

export const UserReducer =  (state = INIT_STATE, action) => {

  console.log(action);

  switch (action.type) {
    case 'START_GET_USERS': {
      return {
        ...state, success: null, isLoading: true, dataList: []
      }
    }

    case 'START_CREATE_USER': {
      return {
        ...state, success: null,
        isLoading: true,
      }
    }

    case 'START_UPDATE_USER': {
      return {
        ...state, success: null, isLoading: true, dataUpdate: []
      }
    }

    case 'START_GET_USER': {
      return {
        ...state, success: null, isLoading: true
      }
    }

    case 'GET_USERS_SUCCESS': {
      console.log(action)
      return {
        ...state, success: action.success, isLoading: false, dataList: action.payload, message: action.message
      }
    }

    case 'CREATE_USER_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataCreate: action.payload, message: action.message
      }
    }
    case 'UPDATE_USER_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataDetail: action.payload, message: action.message
      }
    }

    case 'GET_USER_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataDetail: action.payload, message: action.message
      }
    }

    default:
      return state;
  }
}

export default UserReducer;
