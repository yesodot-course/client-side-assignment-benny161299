import axios, { type AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});


import i18n from '../i18n';

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; status?: string }>) => {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      return Promise.reject(new Error(serverMessage));
    }

    return Promise.reject(error instanceof Error ? error : new Error(i18n.t('errors.network_error')));
  },
);
