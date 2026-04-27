import axios, { type AxiosError } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10_000,
});

// ─── Response interceptor ─────────────────────────────────────────────────────
// Extracts the server's `message` field from JSON error responses so that
// `err.message` in components always contains a human-readable string.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; status?: string }>) => {
    const serverMessage = error.response?.data?.message;
    if (serverMessage) {
      // Replace the generic Axios message with the server's message
      return Promise.reject(new Error(serverMessage));
    }
    // Network / timeout errors — keep the original message
    return Promise.reject(error instanceof Error ? error : new Error('שגיאת רשת'));
  },
);
