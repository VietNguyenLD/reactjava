import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

/*----------------------------------------REDUCERS------------------------------------------*/
import zoneReducer from './zoneReducer';

import PromotionReducer from './Promotion/PromotionReducer';
import ConditionReducer from './Promotion/PromotionConditionReducer';
import ProvinceReducer from './General/ProvinceReducer';
import authReducer from './authReducer';
import commonReducer from './commonReducer';
import uploadReducer from './uploadReducer';
import UserReducer from './User/UserReducer'

export default combineReducers({
    commonReducer: commonReducer,
    UserReducer: UserReducer,
    authReducer: authReducer,
    zoneReducer: zoneReducer,
    routerReducer: routerReducer,
    PromotionReducer: PromotionReducer,
    ProvinceReducer: ProvinceReducer,
    ConditionReducer: ConditionReducer,
    uploadReducer: uploadReducer
});
