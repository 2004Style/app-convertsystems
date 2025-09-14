import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Configuración base de Axios
const apiConfig: AxiosRequestConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
    'X-Forwarded-Proto': 'https',
  },
};

// Crear instancia de Axios
export const apiClient: AxiosInstance = axios.create(apiConfig);

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
  (error) => {
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
