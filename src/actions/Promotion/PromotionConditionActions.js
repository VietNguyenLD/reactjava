import * as api from './../../network/ApiService';
export const API_CONDITION = "v1/promotion-condition";

/* GET LIST CONDITION */
export function StartGetConditions() {
    return { type: 'START_GET_CONDITIONS' };
}

export function GetConditionsSuccess(data) {
    return {
        type: 'GET_CONDITIONS_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const GetConditions = (params) => {
    return (dispatch) => {
        dispatch(StartGetConditions());
        api.getAll(API_CONDITION, params, function (response) {
            console.log(response)
            dispatch(GetConditionsSuccess(response))
        });
    };
};

/* GET DETAIL CONDITION */

export function StartGetCondition() {
    return { type: 'START_GET_CONDITION' };
}

export function GetConditionSuccess(data) {
    return {
        type: 'GET_CONDITION_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const GetCondition = (id, params) => {
    return (dispatch) => {
        dispatch(StartGetCondition());
        api.getOne(API_CONDITION, id ,params, function (response) {
            console.log(response)
            dispatch(GetConditionSuccess(response))
        });
    };
};
