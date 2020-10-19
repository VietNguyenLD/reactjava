import React from 'react';

const ZoneList = React.lazy(() => import('./views/Location/Zone/ZoneList'));

/* PROMOTION CONFIG */
const PromotionList = React.lazy(() => import('./views/Promotion/General/PromotionList'));
const PromotionCreate = React.lazy(() => import('./views/Promotion/General/PromotionCreate'));
const PromotionDetail = React.lazy(() => import('./views/Promotion/General/PromotionDetail'));

const PromotionReport = React.lazy(() => import('./views/Promotion/Report/PromotionReport'));
// const UploadFileIndex = React.lazy(() => import('./views/uploadFile/UploadFileIndex'));

const ReportBillOnline = React.lazy(() => import('./views/Report/BillOnlineReport'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/zone', exact: true, name: 'Zone', component: ZoneList },

  { path: '/reportRevenue', exact: true, name: 'Báo cáo Bill Online', component: ReportBillOnline },

  { path: '/promotion', exact: true, name: 'Khuyến mãi', component: PromotionList },

  { path: '/promotion/create', exact: true, name: 'Tạo Khuyến mãi', component: PromotionCreate },

  { path: '/promotion/detail/:id', exact: true, name: 'Chi tiết khuyến mãi', component: PromotionDetail },

  { path: '/promotion/report/:id', exact: true, name: 'Báo cáo sử dụng', component: PromotionReport },

  // { path: '/upload', exact: true, name: 'Quản lý file', component: UploadFileIndex },
];

export default routes;
