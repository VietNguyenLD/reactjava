import * as api from './../network/ApiService';
export const API_LOGIN = "authenticate";

export function StartLogin() {
    return { type: 'START_LOGIN' };
}

export function LoginSuccess(data) {
    return {
        type: 'LOGIN_SUCCESS',
        payload: data.token,
        success: true,
        message: "Get token success"
        // last_page: data.paging.last_page,
    };
}

export function loginFailed(dataLogin){
    return {
        type: "LOGIN_FAILED",
        payload: null,
        success: false,
        message: "Get token fail"
    };
};

export const LoginSys = (params) => {
    return (dispatch) => {
        dispatch(StartLogin());
        api.sigin(API_LOGIN, params, function (response) {
            console.log(response)
            if(typeof response.token !== undefined){
                localStorage.setItem("promoAuthenticate",'Bearer '+response.token);
                dispatch(LoginSuccess(response))
            }else{
                dispatch(loginFailed(response))
            }

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

