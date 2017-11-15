import axios from 'axios';

const setHeaders = () => {
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  axios.defaults.headers.common.Authorization = localStorage.getItem('auth:token');
};

export const get = async (route) => {
  try {
    setHeaders();
    return axios.get(route);
  } catch (err) {
    throw err;
  }
};

export const post = async (route, data) => {
  try {
    setHeaders();
    return axios.post(route, data);
  } catch (err) {
    throw err;
  }
};
