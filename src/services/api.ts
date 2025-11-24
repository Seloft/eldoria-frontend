import axios, { AxiosError, type AxiosInstance } from 'axios';

export interface ApiResponse<T> {
    total_hits: number;
    limit: number;
    offset: number;
    last_offset: number;
    results: T[];
}

const api: AxiosInstance = axios.create({
    baseURL: "/api",
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: false,
});

api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

export default api;
