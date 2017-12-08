import axios from 'axios';
import path from 'path';

const setHeaders = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.common.Authorization = localStorage.getItem('auth:token');
};

export const getWorld = async (route) => {
  axios.defaults.headers.common = {};
  return axios.get(route);
};

export const get = async (route) => {
  setHeaders();
  return axios.get(path.resolve(route));
};

export const post = async (route, data) => {
  setHeaders();
  return axios.post(path.resolve(route), data);
};
