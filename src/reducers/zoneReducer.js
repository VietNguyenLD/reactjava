export const zoneReducer = (state = {}, action) => {
    //console.log(action);
  
    switch (action.type) {
      case 'LIST_ZONE':
        return {
          ...state,
          zones: action.data ? action.data:[],
          errors: action.error ? [action.error] : null,
        };
      case 'SET_ZONE_NAME':
        return {
          ...state,
          zone_name: action.zone_name
        };
        
      default:
        return state
    }
  }
  
export default zoneReducer;
