import * as api from './../../network/ApiService';
export const API_PROMOTION = "v1/promotion";

export function StartGetPromotions() {
    return { type: 'START_GET_PROMOTIONS' };
}

export function StartCreatePromotion() {
    return { type: 'START_CREATE_PROMOTION' };
}

export function StartUpdatePromotion() {
    return { type: 'START_UPDATE_PROMOTION' };
}

export function StartGetPromotion() {
    return { type: 'START_GET_PROMOTION' };
}

export function GetPromotionsSuccess(data) {
    console.log(data);
    return {
        type: 'GET_PROMOTIONS_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}
export function CreatePromotionSuccess(data) {
    console.log(data);
    return {
        type: 'CREATE_PROMOTION_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export function UpdatePromotionSuccess(data) {
    console.log(data);
    return {
        type: 'UPDATE_PROMOTION_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export function GetPromotionSuccess(data) {
    console.log(data);
    return {
        type: 'GET_PROMOTION_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}
export const GetPromotions = (params) => {
    return (dispatch) => {
        dispatch(StartGetPromotions());
        api.getAll(API_PROMOTION, params, function (response) {
            console.log(response)
            dispatch(GetPromotionsSuccess(response))
        });
    };
};

export const GetPromotion = (id,params) => {
    return (dispatch) => {
        dispatch(StartGetPromotion());
        api.getOne(API_PROMOTION,id, params, function (response) {
            console.log(response)
            dispatch(GetPromotionSuccess(response))
        });
    };
};

export const CreatePromotion = (params) => {
    return (dispatch) => {
        dispatch(StartGetPromotions());
        api.create(API_PROMOTION, params, function (response) {
            console.log(response)
            dispatch(CreatePromotionSuccess(response))
        });
    };
};


export const UpdatePromotion = (id,params) => {
    return (dispatch) => {
        dispatch(StartUpdatePromotion());
        api.update(API_PROMOTION, id, params, function (response) {
            console.log(response)
            dispatch(UpdatePromotionSuccess(response))
        });
    };
};

export function StartReportPromotion() {
    return { type: 'START_REPORT_PROMOTION' };
}

export function ReportPromotionSuccess(data) {
    console.log(data);
    return {
        type: 'REPORT_PROMOTION_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const ReportPromotion = (params) => {
    return (dispatch) => {
        dispatch(StartReportPromotion());
        api.getAll("v1/promotion-report", params, function (response) {
            console.log(response)
            dispatch(ReportPromotionSuccess(response))
        });
    };
};

export function StartSummaryPromotion() {
    return { type: 'START_SUMMARY_PROMOTION' };
}

export function ReportSummarySuccess(data) {
    console.log(data);
    return {
        type: 'SUMMARY_PROMOTION_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const SummaryPromotion = (params) => {
    return (dispatch) => {
        dispatch(StartSummaryPromotion());
        api.getAll("v1/promotion-summary", params, function (response) {
            console.log(response)
            dispatch(ReportSummarySuccess(response))
        });
    };
};

export function StartListUsedCoupon() {
    return { type: 'START_LIST_USED_COUPON' };
}

export function GetListUsedCouponSuccess(data) {
    console.log(data);
    return {
        type: 'LIST_USED_COUPON_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const ListUsedCoupon = (params) => {
    return (dispatch) => {
        dispatch(StartListUsedCoupon());
        api.getAll("v1/promotion-released", params, function (response) {
            console.log(response)
            dispatch(GetListUsedCouponSuccess(response))
        });
    };
};

export function StartExportUsed() {
    return { type: 'START_EXPORT_USED_COUPON' };
}

export function ExportUsedCouponSuccess(data) {
    console.log(data);
    return {
        type: 'EXPORT_USED_COUPON_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const ExportUsedCoupon = (params) => {
    return (dispatch) => {
        dispatch(StartExportUsed());
        api.exportExcel("v1/used-promotion", params, function (response) {
            console.log(response)
            dispatch(ExportUsedCouponSuccess(response))
        });
    };
};

export function StartExportBO() {
    return { type: 'START_EXPORT_BO' };
}

export function ExportBOSuccess(data) {
    console.log(data);
    return {
        type: 'EXPORT_BO_SUCCESS',
        payload: data.data,
        success: data.success,
        message: data.message
        // last_page: data.paging.last_page,
    };
}

export const ExportBOReport = (params) => {
    return (dispatch) => {
        dispatch(StartExportBO());
        api.exportExcel("v1/export-report", params, function (response) {
            console.log(response)
            dispatch(ExportBOSuccess(response))
        });
    };
};





