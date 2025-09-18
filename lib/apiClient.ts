import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendTokens } from '../interfaces/interfaces';

// Configuración base de Axios
const apiConfig: AxiosRequestConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 20000, // 20 segundos
  headers: {
    'Content-Type': 'application/json',
    'X-Forwarded-Proto': 'https',
  },
};

// Crear instancia de Axios
export const apiClient: AxiosInstance = axios.create(apiConfig);

// Variable para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Función para procesar la cola de peticiones fallidas
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

// Función para refrescar el token
const refreshAuthToken = async (refreshToken: string): Promise<string | null> => {
  try {
    const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`, {
      refreshToken: refreshToken,
    });

    if (response.data && response.data.data) {
      const newTokens: backendTokens = response.data.data;

      // Actualizar tokens en AsyncStorage
      await AsyncStorage.setItem('@app-convertsystems/tokens', JSON.stringify(newTokens));

      // Actualizar sesión completa
      const storedSession = await AsyncStorage.getItem('@app-convertsystems/session');
      if (storedSession) {
        const parsedSession = JSON.parse(storedSession);
        parsedSession.backendTokens = newTokens;
        await AsyncStorage.setItem('@app-convertsystems/session', JSON.stringify(parsedSession));
      }

      return newTokens.accessToken;
    }
    return null;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

// Interceptor para requests - agregar tokens automáticamente
apiClient.interceptors.request.use(
  (config) => {
    // Los tokens se agregarán dinámicamente en cada request
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para responses - manejo de errores global
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es un error 401 y no es un intento de refresh y no hemos intentado ya refrescar
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Si ya estamos refrescando, agregar a la cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Obtener el refresh token del storage
        const storedTokens = await AsyncStorage.getItem('@app-convertsystems/tokens');
        if (!storedTokens) {
          throw new Error('No hay tokens almacenados');
        }

        const tokens: backendTokens = JSON.parse(storedTokens);
        const newAccessToken = await refreshAuthToken(tokens.refreshToken);

        if (newAccessToken) {
          // Token refrescado exitosamente
          processQueue(null, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        } else {
          // No se pudo refrescar el token
          processQueue(new Error('Unable to refresh token'), null);

          // Limpiar sesión
          await AsyncStorage.multiRemove([
            '@app-convertsystems/session',
            '@app-convertsystems/user',
            '@app-convertsystems/tokens',
          ]);

          // Redireccionar al login (esto debería manejarse desde el contexto)
          return Promise.reject(error);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Limpiar sesión
        await AsyncStorage.multiRemove([
          '@app-convertsystems/session',
          '@app-convertsystems/user',
          '@app-convertsystems/tokens',
        ]);

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Manejo de errores de red, timeout, etc.
    if (error.code === 'ECONNABORTED') {
      return Promise.reject({
        message: 'Tiempo de espera agotado. Verifica tu conexión.',
        status: 'timeout',
      });
    }

    if (!error.response) {
      return Promise.reject({
        message: 'Error de conexión. Verifica tu conexión a internet.',
        status: 'network_error',
      });
    }

    return Promise.reject(error);
  }
);

// Función helper para manejar respuestas de la API
export const handleApiResponse = (response: AxiosResponse) => {
  const { data, status } = response;

  if (status >= 200 && status < 300) {
    return {
      alert: 'success' as const,
      data: data.data || data,
      message: data.message || 'Operación exitosa',
    };
  }

  return {
    alert: 'error' as const,
    data: data.data || null,
    message: data.message || 'Error en la operación',
  };
};

// Función helper para manejar errores de la API
export const handleApiError = (error: any) => {
  if (error.response) {
    // El servidor respondió con un código de error
    const { data, status } = error.response;

    if (status === 400) {
      return {
        alert: 'warning' as const,
        data: data.data || null,
        message: data.message || 'Datos inválidos',
      };
    }

    if (status === 401) {
      return {
        alert: 'error' as const,
        data: null,
        message: 'No autorizado. Por favor inicia sesión nuevamente.',
      };
    }

    if (status === 403) {
      return {
        alert: 'error' as const,
        data: null,
        message: 'No tienes permisos para realizar esta acción.',
      };
    }

    if (status >= 500) {
      return {
        alert: 'error' as const,
        data: null,
        message: 'Error del servidor. Intenta nuevamente más tarde.',
      };
    }

    return {
      alert: 'error' as const,
      data: data.data || null,
      message: data.message || 'Error en la operación',
    };
  }

  // Error de red, timeout, etc.
  return {
    alert: 'error' as const,
    data: null,
    message: error.message || 'Error de conexión',
  };
};
