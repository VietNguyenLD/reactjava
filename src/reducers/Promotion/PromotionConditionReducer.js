const INIT_STATE = {
  app: [],
  success: null,
  message: '',
  isLoading: false,
  dataListCondition: [],
  dataDetailCondition: []
};

export const ConditionReducer =  (state = INIT_STATE, action) => {
  switch (action.type) {

    /* GET LIST CONDITION */
    case 'START_GET_CONDITIONS': {
      return {
        ...state, success: null, isLoading: true, dataListCondition: []
      }
    }
    case 'GET_CONDITIONS_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataListCondition: action.payload, message: action.message
      }
    }

    /* GET DETAIL CONDITION */

    case 'START_GET_CONDITION': {
      return {
        ...state, success: null, isLoading: true, dataDetailCondition: []
      }
    }
    case 'GET_CONDITION_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataDetailCondition: action.payload, message: action.message
      }
    }

    default:
      return state;
  }
}

export default ConditionReducer;
