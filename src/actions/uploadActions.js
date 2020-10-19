import * as api from './../network/ApiService';
export const API_UPLOAD = "v1/fs-object";
export const API_CREATE = "v1/fs-initFolder";
export const API_DOWNLOAD = "v1/fs-download";

export function StartGetListUpload() {
    return { type: 'START_GET_LIST_UPLOAD' };
}

export function StartGetListAfterUpload() {
    return { type: 'START_GET_LIST_AFTER_UPLOAD' };
}
export function GetListUploadSuccess(data) {
    return {
        type: 'GET_LIST_UPLOAD_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}
export function GetListAfterUploadSuccess(data) {
    return {
        type: 'GET_LIST_AFTER_UPLOAD_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}
export function StartCreateFolder() {
    return { type: 'START_CREATE_FOLDER' };
}

export function StartCreateFolderRoot() {
    return { type: 'START_CREATE_FOLDER_ROOT' };
}
export function CreateFolderSuccess(data) {
    return {
        type: 'CREATE_FOLDER_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export function CreateFolderRootSuccess(data) {
    return {
        type: 'CREATE_FOLDER_ROOT_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}
export function StartUploadFile() {
    return { type: 'START_UPLOAD_FILE' };
}

export function UploadFileSuccess(data) {
    return {
        type: 'UPLOAD_FILE_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export function StartDeleteFile() {
    return { type: 'START_DELETE_FILE' };
}

export function DeleteFileSuccess(data) {
    return {
        type: 'DELETE_FILE_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export function StartDownloadFile() {
    return { type: 'START_DOWNLOAD_FILE' };
}

export function DownloadFileSuccess(data) {
    return {
        type: 'DOWNLOAD_FILE_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}
export const GetListUpload = (params, id) => {
    return (dispatch) => {
        dispatch(StartGetListUpload());
        api.getOne(API_UPLOAD, id, params, function (response) {
            console.log(response)
            dispatch(GetListUploadSuccess(response))
        });
    };
};
export const GetListAfterUpload = (params, id) => {
    return (dispatch) => {
        dispatch(StartGetListAfterUpload());
        api.getOne(API_UPLOAD, id, params, function (response) {
            console.log(response)
            dispatch(GetListAfterUploadSuccess(response))
        });
    };
};
export const DownloadFile = (params, id) => {
    return (dispatch) => {
        dispatch(StartDownloadFile());
        api.getOne(API_DOWNLOAD, id, params, function (response) {
            console.log(response)
            dispatch(DownloadFileSuccess(response))
        });
    };
};

export const CreateFolder = (params) => {
    return (dispatch) => {
        dispatch(StartCreateFolder());
        api.create(API_UPLOAD, params, function (response) {
            console.log(response)
            dispatch(CreateFolderSuccess(response))
        });
    };
};
export const CreateFolderRoot = (params) => {
    return (dispatch) => {
        dispatch(StartCreateFolderRoot());
        api.create(API_CREATE, params, function (response) {
            console.log(response)
            dispatch(CreateFolderRootSuccess(response))
        });
    };
};

export const UploadFile = (params) => {
    return (dispatch) => {
        dispatch(StartUploadFile());
        api.uloadfile(API_UPLOAD, params, function (response) {
            console.log(response)
            dispatch(UploadFileSuccess(response))
        });
    };
};

export const DeleteFile = (params, id) => {
    return (dispatch) => {
        dispatch(StartDeleteFile());
        api.deLete(API_UPLOAD, id, params, function (response) {
            console.log(response)
            dispatch(DeleteFileSuccess(response))
        });
    };
};