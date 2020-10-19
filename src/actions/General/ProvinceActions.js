import * as api from './../../network/ApiService';
export const API_PROVINCE = "v1/province";

export function StartGetProvinces() {
    return { type: 'START_GET_PROVINCES' };
}

export function GetProvincesSuccess(data) {
    console.log(data);
    return {
        type: 'GET_PROVINCES_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const GetProvinces = (params) => {
    return (dispatch) => {
        dispatch(StartGetProvinces());
        api.getAll(API_PROVINCE, params, function (response) {
            console.log(response)
            dispatch(GetProvincesSuccess(response))
        });
    };
};


