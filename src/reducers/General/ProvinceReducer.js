const INIT_STATE = {
  app: [],
  success: null,
  message: '',
  isLoading: false,
  listProvince: []
};

export const Provinceducer =  (state = INIT_STATE, action) => {
  switch (action.type) {

    case 'START_GET_PROVINCES': {
      return {
        ...state, success: null, isLoading: true, listProvince: []
      }
    }
    
    case 'GET_PROVINCES_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, listProvince: action.payload, message: action.message
      }
    }

    default:
      return state;
  }
}

export default Provinceducer;
