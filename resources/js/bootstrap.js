import axios from 'axios';
window.axios = axios;

// Establece la URL base para las peticiones
axios.defaults.baseURL = 'https://villa.ndnestor.com';

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
