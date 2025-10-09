// /plat_inovacao/src/lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// Este interceptor vai adicionar o token de autenticação em todas as
// requisições futuras, depois que fizermos o login.
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('innovate_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.access_token) {
          config.headers.Authorization = `Bearer ${userData.access_token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;