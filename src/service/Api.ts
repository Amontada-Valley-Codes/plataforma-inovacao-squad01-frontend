import axios from 'axios';

// Cria uma instância do Axios com a URL base da nossa API
export const api = axios.create({
  baseURL: 'http://localhost:3000', // A porta onde o seu back-end NestJS está a rodar
});

// Função para adicionar o token JWT ao cabeçalho de autorização
export const setAuthHeader = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};