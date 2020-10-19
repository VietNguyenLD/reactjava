import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
import {API_URL} from './config/Config'

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = API_URL;
// const API_ROOT = 'http://api.promotion.me/';

const encode = encodeURIComponent;
const responseBody = res => res.body;

let token = null;
const tokenPlugin = req => {
  if (token) {
    req.set('Authorization', `${token}`);
  }
}

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody),
  get: url =>{
    return superagent.get(`${API_ROOT}${url}`).use(tokenPlugin).then(responseBody)
  },
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).use(tokenPlugin).then(responseBody)
};

const Auth = {
  current: (_token) =>
    requests.get(`v1/be-currentUser?token=${_token}`).then(data=>{
      console.log(data);
      return data;
    }),
};

export default {
  Auth,
  setToken: _token => { token = _token; }
};
