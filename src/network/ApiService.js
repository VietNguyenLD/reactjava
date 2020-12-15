import axios from 'axios';
import { Modal } from 'antd';
import { API_URL } from '../config/Config';
import { history } from '../history';
import { TOKEN } from './../constants/AppConst';

let endpoint = API_URL;

/*-----------------------------GET ALL----------------------------------------*/
export function getAll(api_name, params, callback) {
  let _apiUrl = endpoint + api_name;
  // let _headers = setHeaders();
  let _params = setParams(params);
  let _authorization = localStorage.getItem(TOKEN);
  debugger
  let _headers = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': localStorage.getItem(TOKEN),
      'Access-Control-Allow-Origin': '*'
    }
  };

  // axios.defaults.headers.common['Authorization'] = _authorization;

  axios.get(_apiUrl, _params, _headers).then(function (response) {
    console.log(response);
    callback(response.data);
  }).catch(error => {
    console.log(error)
    // catchError(error);
  });
}

/*-----------------------------EXPORT EXCEL----------------------------------------*/
export function exportExcel(api_name, params, callback) {
  let _apiUrl = endpoint + api_name;
  let _headers = setHeaders();
  let _params = setParams(params);
  let _authorization = localStorage.getItem('_UID');
  axios.defaults.headers.common['Authorization'] = _authorization;

  // axios.get(_apiUrl, _params, _headers).then(function (response) {
  //   callback(response.data);
  // }).catch(error => {
  //   catchError(error);
  // });

  axios({
    url: _apiUrl,
    params: params,
    method: 'GET',
    responseType: 'blob', // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    let newDate = new Date()
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    link.href = url;
    link.setAttribute('download', 'Report_' + year + month + date + '.xlsx'); //or any other extension
    document.body.appendChild(link);
    link.click();
  });
}

/*-----------------------------GET ONE----------------------------------------*/
export function getOne(api_name, id, params, callback) {
  let _apiUrl = endpoint + api_name + '/' + id;
  let _headers = setHeaders();
  let _params = setParams(params);
  let _authorization = localStorage.getItem(TOKEN);
  axios.defaults.headers.common['Authorization'] = _authorization;

  axios.get(_apiUrl, _params, _headers).then(function (response) {
    callback(response.data);
  }).catch(error => {
    catchError(error);
  });
}

/*-----------------------------POST-------------------------------------------*/
export function create(api_name, params, callback) {
  let _apiUrl = endpoint + api_name;
  let _headers = setHeaders();
  let _params = JSON.stringify(params);
  let _authorization = localStorage.getItem(TOKEN);
  axios.defaults.headers.common['Authorization'] = _authorization;

  axios.post(_apiUrl, _params, _headers).then(function (response) {
    callback(response.data);
  }).catch(error => {
    console.log(error)
    catchError(error);
  });
}

export function uloadfile(api_name, params, callback) {
  let _apiUrl = endpoint + api_name;
  let _authorization = localStorage.getItem(TOKEN);
  axios.defaults.headers.common['Authorization'] = _authorization;
  let _params = JSON.stringify(params);

  axios.post(_apiUrl, _params, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(function (response) {
    callback(response.data);
  }).catch(error => {
    throw (error);
  });
}

export function deLete(api_name, id, params, callback) {
  let _apiUrl = endpoint + api_name + '/' + id;
  let _headers = setHeaders();
  let _params = setParams(params);
  let _authorization = localStorage.getItem(TOKEN);
  axios.defaults.headers.common['Authorization'] = _authorization;

  axios.delete(_apiUrl, _params, _headers).then(function(response) {
    callback(response.data);
  }).catch(error => {
    throw(error);
  });
}

/*-----------------------------SIGIN------------------------------------------*/
export function sigin(api_name, params, callback) {
  let _apiUrl = endpoint + api_name;
  let _headers = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  };
  let _params = JSON.stringify(params);

  axios.post(_apiUrl, _params, _headers).then(function (response) {
    // callback(response.data);
    let data = response.data;

    if (data.success === false) {
      Modal.error({
        title: 'Infomation',
        content: data.message
      });
    } else {
      callback(data);
    }
  }).catch(error => {
    catchError(error);
  });
}

/*-----------------------------PUT--------------------------------------------*/
export function update(api_name, id, params, callback) {
  let _apiUrl = endpoint + api_name + '/' + id;
  if(id === ''){
    _apiUrl = endpoint + api_name;
  }
  let _headers = setHeaders();
  let _params = JSON.stringify(params);
  let _authorization = localStorage.getItem(TOKEN);
  axios.defaults.headers.common['Authorization'] = _authorization;

  axios.put(_apiUrl, _params, _headers).then(function (response) {
    callback(response.data);
  }).catch(error => {
    catchError(error);
  });
}

/*-----------------------------UPLOAD IMAGE FILE-----------------------------------*/
export function uploadImages(api_name, params, files, callback) {
  let _apiUrl = endpoint + api_name;
  let formData = new FormData();
  let _authorization = localStorage.getItem(TOKEN);
  axios.defaults.headers.common['Authorization'] = _authorization;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const val = params[key];
      formData.append(key, val);
    }
  }

  let i = 0;
  for (i = 0; i < files.length; i++) {
    let file = files[i];
    formData.append('images[]', file, file.name);
  }

  axios.post(_apiUrl, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(function (response) {
    callback(response.data);
  }).catch(error => {
    throw (error);
  });
}

/*-----------------------------SET HEADERS------------------------------------*/
export function setHeaders() {
  let _authorization = localStorage.getItem(TOKEN);
  let _axios_header = {
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Authorization': _authorization
    }
  };
  return _axios_header;
}

/*-----------------------------SET PARAMS-------------------------------------*/
export function setParams(params) {
  let axios_params = {
    params: params
  };
  return axios_params;
}

export function catchError(error) {
  if (error.response?.status === 404) {
    // history.push("#/404");
    Modal.error({
      title: 'Thông Báo',
      content: (error.response.statusText),
      onOk: () => {
        history.push("#/404");
      }
    });
  } else if (error.response.status === 500) {
    Modal.error({
      title: 'Thông Báo',
      content: (error.response.statusText),
      onOk: () => {
        window.location.reload();
      }
    });
    // history.push("#/500");
  } else if (error.response.status === 408) {
    Modal.error({
      title: 'Thông Báo',
      content: 'Phiên của bạn đã hết hạn',
      onOk: () => {
        history.push("/login");
        window.location.reload(true);
      }
    });
  } else if (error.response.status === 401) {
    Modal.error({
      title: 'Thông Báo',
      content: 'Bạn Không có quyền truy cập',
      onOk: () => {
        history.push("/");
        window.location.reload(true);
      }
    });
  }

  //window.location.reload(true);
}
