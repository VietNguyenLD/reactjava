import * as api from './../network/ApiService';
export const API_LOGIN = "v1/be-signIn";

export function StartLogin() {
    return { type: 'START_LOGIN' };
}

export function LoginSuccess(data) {
    return {
        type: 'LOGIN_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const LoginSys = (params) => {
    return (dispatch) => {
        dispatch(StartLogin());
        api.create(API_LOGIN, params, function (response) {
            console.log(response)
            if(response.success == true){
                localStorage.setItem("promoAuthenticate",response.data.token);
                localStorage.setItem("UIDD",response.data.userInfo.id);
            }
            dispatch(LoginSuccess(response))
        });
    };
};

export function StartGetCurrentUser() {
    return { type: 'START_GET_CURRENT_USER' };
}

export function GetCurrentUserSuccess(data) {
    return {
        type: 'GET_CURRENT_USER_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const GetCurrentUser = (params) => {
    return (dispatch) => {
        dispatch(StartLogin());
        api.getAll('v1/be-currentUser', params, function (response) {
            console.log(response)
            dispatch(GetCurrentUserSuccess(response))
        });
    };
};

