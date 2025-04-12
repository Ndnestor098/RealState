import axios from 'axios';
window.axios = axios;

// Establece la URL base para las peticiones
axios.defaults.baseURL = import.meta.env.VITE_APP_URL || 'https://villa.ndnestor.com'; // Asegúrate de que esté en HTTPS

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
