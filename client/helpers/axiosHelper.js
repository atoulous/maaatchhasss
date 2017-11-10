import axios from 'axios';

const setHeaders = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.common.Authorization = localStorage.getItem('auth:token');
};

export const get = async (route) => {
  setHeaders();
  return axios.get(route);
};

export const post = async (route, data) => {
  setHeaders();
  return axios.post(route, data);
};
