import moment from 'moment';
export const FORMAT_DATE = "YYYY-MM-DD";
export const FORMAT_DATE_TIME = "YYYY-MM-DD HH-MM-SS";
export const TOKEN ='promoAuthenticate';

// Object
export const ranges = {
  'Today': [moment(), moment()],
  'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
  'Last 7 Days': [moment().subtract(6, 'days'), moment()],
  'Last 30 Days': [moment().subtract(29, 'days'), moment()],
  'This Month': [moment().startOf('month'), moment().endOf('month')],
  'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
};
