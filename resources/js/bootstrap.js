import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';

const token = localStorage.getItem('accessToken');
if (token) {
  window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}