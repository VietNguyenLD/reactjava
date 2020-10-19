

const INIT_STATE = {
    app: [],
    currentUser: [],
    successcreate: null
};

export const uploadReducer = (state = {}, action) => {
    switch (action.type) {
        case 'START_LOGIN':

        // case 'LOGIN_SUCCESS':
        //     return {
        //         ...state, isLoading: false, success: action.success
        //     }
        case 'START_GET_LIST_UPLOAD':
            return {
                ...state, isLoading: true, success: action.success, data: []
            }
        case 'START_GET_LIST_AFTER_UPLOAD':
            return {
                ...state, isLoading: true, success: action.success, dataafter: []
            }
        case 'START_CREATE_FOLDER':
            return {
                ...state, isLoading: true, successcreate: null, datacreate: []
            }
        case 'START_CREATE_FOLDER_ROOT':
            return {
                ...state, isLoading: true, successcreateroot: null, datacreate: []
            }
        case 'START_UPLOAD_FILE':
            return {
                ...state, isLoading: true, successupload: null, datauploads: []
            }
        case 'START_DELETE_FILE':
            return {
                ...state, isLoading: true, successdelete: null, datadelete: []
            }
        case 'START_DOWNLOAD_FILE':
            return {
                ...state, isLoading: true, successdownload: null, datadownload: []
            }
        case 'GET_LIST_UPLOAD_SUCCESS':
            return {
                ...state, isLoading: false, success: action.success, dataupload: action.payload
            }
        case 'GET_LIST_AFTER_UPLOAD_SUCCESS':
            return {
                ...state, isLoading: false, success: action.success, dataafter: action.payload
            }
        case 'CREATE_FOLDER_SUCCESS':
            return {
                ...state, isLoading: false, successcreate: action.success, datacreate: action.payload
            }
        case 'CREATE_FOLDER_ROOT_SUCCESS':
            return {
                ...state, isLoading: false, successcreateroot: action.success, datacreate: action.payload
            }
        case 'UPLOAD_FILE_SUCCESS':
            return {
                ...state, isLoading: false, successupload: action.success, datauploads: action.payload
            }
        case 'DELETE_FILE_SUCCESS':
            return {
                ...state, isLoading: false, successdelete: action.success, datadelete: action.payload
            }
        case 'DOWNLOAD_FILE_SUCCESS':
            return {
                ...state, isLoading: false, successdownload: action.success, datadownload: action.payload
            }
        default:
            return state;
    }
}

export default uploadReducer;
