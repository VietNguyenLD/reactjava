const INIT_STATE = {
  app: [],
  success: null,
  message: '',
  isLoading: false,
  dataUpdate: [],
  dataCreate: [],
  dataList:[],
  dataDetail:[],
  dataReport:[],
  dataSummary:[],
  dataUsedCoupon:[],
  dataExport:[]
};

export const PromotionReducer =  (state = INIT_STATE, action) => {
  
  console.log(action);

  switch (action.type) {
    case 'START_GET_PROMOTIONS': {
      return {
        ...state, success: null, isLoading: true, dataList: []
      }
    }

    case 'START_CREATE_PROMOTION': {
      return {
        ...state, success: null, 
        isLoading: true, 
        // dataCreate: []
      }
    }

    case 'START_UPDATE_PROMOTION': {
      return {
        ...state, success: null, isLoading: true, dataUpdate: []
      }
    }

    case 'START_GET_PROMOTION': {
      return {
        ...state, success: null, isLoading: true
      }
    }
    
    case 'GET_PROMOTIONS_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataList: action.payload, message: action.message
      }
    }

    case 'CREATE_PROMOTION_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataCreate: action.payload, message: action.message
      }
    }
    case 'UPDATE_PROMOTION_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataDetail: action.payload, message: action.message
      }
    }

    case 'GET_PROMOTION_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataDetail: action.payload, message: action.message
      }
    }

    case 'START_REPORT_PROMOTION':{
      return {
        ...state, success: null, isLoading: true
      }
    }
    case 'REPORT_PROMOTION_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataReport: action.payload, message: action.message
      }
    }

    case 'START_SUMMARY_PROMOTION':{
      return {
        ...state, success: null, isLoading: true
      }
    }
    case 'SUMMARY_PROMOTION_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataSummary: action.payload, message: action.message
      }
    }

    case 'START_LIST_USED_COUPON':{
      return {
        ...state, success: null, isLoading: true
      }
    }
    case 'LIST_USED_COUPON_SUCCESS': {
      return {
        ...state, success: action.success, isLoading: false, dataUsedCoupon: action.payload, message: action.message
      }
    }
    
    case 'START_EXPORT_USED_COUPON': {
      return {
        ...state, success: null, isLoading: false, dataExport: []
      }
    }

    case 'EXPORT_USED_COUPON_SUCCESS': {
      return {
        ...state, success: null, isLoading: true, dataExport: []
      }
    }

    case 'START_EXPORT_BO': {
      return {
        ...state, success: null, isLoading: false, dataExport: []
      }
    }

    case 'EXPORT_BO_SUCCESS': {
      return {
        ...state, success: null, isLoading: true, dataExport: []
      }
    }

    default:
      return state;
  }
}

export default PromotionReducer;
