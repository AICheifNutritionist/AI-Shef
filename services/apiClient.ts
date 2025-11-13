import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import keycloak from '../config/keycloak';
import tokenStorage from '../utils/tokenStorage';

const API_PREFIX = '/webhook';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (config.url && !config.url.startsWith('http')) {
      config.url = `${API_PREFIX}${config.url}`;
    }

    // Only check token expiry if keycloak is authenticated
    if (keycloak.authenticated && keycloak.isTokenExpired && keycloak.isTokenExpired()) {
      try {
        await keycloak.updateToken(30);

        tokenStorage.setToken(keycloak.token!, keycloak.refreshToken);
      } catch (error) {
        console.error('Failed to refresh token', error);
        keycloak.logout();

        return Promise.reject(error);
      }
    }

    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (error.response?.data?.error) {
      console.log({ error });
      const errorMessage = error.response.data.error;
      const customError = new Error(errorMessage);

      (customError as any).response = error.response;
      (customError as any).status = error.response.status;

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Only try Keycloak token refresh if keycloak is authenticated
        if (keycloak.authenticated) {
          try {
            await keycloak.updateToken(30);
            tokenStorage.setToken(keycloak.token!, keycloak.refreshToken);

            originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;

            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed', refreshError);
            keycloak.logout();

            return Promise.reject(refreshError);
          }
        }
      }

      return Promise.reject(customError);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Only try Keycloak token refresh if keycloak is authenticated
      if (keycloak.authenticated) {
        try {
          await keycloak.updateToken(30);
          tokenStorage.setToken(keycloak.token!, keycloak.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${keycloak.token}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed', refreshError);
          keycloak.logout();

          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
