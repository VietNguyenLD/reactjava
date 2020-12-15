import * as api from './../../network/ApiService';
import axios from 'axios';
export const API_USERS = "api/v1/users";
export const API_USER = "api/v1/user";

export function StartGetUsers() {
  return { type: 'START_GET_USERS' };
}

export function StartCreateUser() {
    return { type: 'START_CREATE_USER' };
}

export function StartUpdateUser() {
  return { type: 'START_UPDATE_USER' };
}

export function StartGetUser() {
  return { type: 'START_GET_USER' };
}

export function GetUsersSuccess(data) {
  return {
    type: 'GET_USERS_SUCCESS',
    payload: data.data,
    success: data.status,
    message: data.message
    // last_page: data.paging.last_page,
  };
}
export function CreateUserSuccess(data) {
  console.log(data);
  return {
    type: 'CREATE_USER_SUCCESS',
    payload: data.data,
    success: data.success,
    message: data.message
    // last_page: data.paging.last_page,
  };
}

export function UpdateUserSuccess(data) {
  console.log(data);
  return {
    type: 'UPDATE_USER_SUCCESS',
    payload: data.data,
    success: data.success,
    message: data.message
    // last_page: data.paging.last_page,
  };
}

export function GetUserSuccess(data) {
  console.log(data);
  return {
    type: 'GET_USER_SUCCESS',
    payload: data.data,
    success: data.success,
    message: data.message
    // last_page: data.paging.last_page,
  };
}

export const GetUsers = (params) => {
  return (dispatch) => {
    dispatch(StartGetUsers());
    api.getAll(API_USERS, params, function (response) {
      dispatch(GetUsersSuccess(response))
    });
  };
};

export const GetUser = (id,params) => {
  return (dispatch) => {
    dispatch(StartGetUser());
    api.getOne(API_USER,id, params, function (response) {
      console.log(response)
      dispatch(GetUserSuccess(response))
    });
  };
};

export const CreateUser = (params) => {
  return (dispatch) => {
    dispatch(StartGetUsers());
    api.create(API_USER, params, function (response) {
      dispatch(CreateUserSuccess(response))
    });
  };
};


export const UpdateUser = (id,params) => {
  return (dispatch) => {
    dispatch(StartUpdateUser());
    api.update(API_USER, id, params, function (response) {
      dispatch(UpdateUserSuccess(response))
    });
  };
};




