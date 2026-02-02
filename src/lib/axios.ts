import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://rickandmortyapi.com/api',
  timeout: 10000,
});

// Interceptor - Solo rechaza sin loguear (el manejo se hace en hooks)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosInstance;
