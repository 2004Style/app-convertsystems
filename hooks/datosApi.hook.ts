import { useAuth } from '../contexts/AuthContext';
import { usePathname } from 'expo-router';
import { isPublicRoute } from '../lib/routes';
import { apiClient, handleApiResponse, handleApiError } from '../lib/apiClient';
import { AxiosRequestConfig } from 'axios';

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ApiResponse {
  alert: string;
  data?: any;
  message?: string;
}

export const MensajeError = (message: any): string => {
  let finalMessage = 'Ocurrió un error';

  if (typeof message === 'string') {
    // Caso 1: mensaje directo
    finalMessage = message;
  } else if (typeof message === 'object' && message !== null) {
    const innerMessage = message.message;

    if (Array.isArray(innerMessage)) {
      // Caso 2: array → tomar solo el primer mensaje
      finalMessage = innerMessage[0] ?? finalMessage;
    } else if (typeof innerMessage === 'string') {
      // Caso 3: string dentro del objeto
      finalMessage = innerMessage;
    } else {
      // Caso raro: otro tipo
      finalMessage = JSON.stringify(innerMessage ?? message);
    }
  }
  //console.log(finalMessage);
  return finalMessage;
};

export const useCosultaApi = () => {
  const pathname = usePathname();
  const { session, status } = useAuth();

  const request = async (
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    headers: Record<string, string> = {},
    body?: any
  ): Promise<ApiResponse> => {
    if (status === 'loading') {
      return {
        alert: 'error',
        message: 'Sesión aún está cargando. Intenta nuevamente.',
      };
    }

    const isPublic = isPublicRoute(pathname);

    if (!isPublic && (status !== 'authenticated' || !session?.backendTokens)) {
      return {
        alert: 'error',
        message: 'No se ha autenticado el usuario o faltan tokens.',
      };
    }

    const accessToken = session?.backendTokens?.accessToken;
    const refreshToken = session?.backendTokens?.refreshToken;

    try {
      const config: AxiosRequestConfig = {
        method,
        url,
        headers: {
          ...headers,
        },
      };

      // Solo agregar tokens si no es una ruta pública
      if (!isPublic && accessToken) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${accessToken}`,
          Refresh: `${refreshToken || ''}`,
        };
      }

      // Agregar body para métodos que lo soportan
      if (body && ['POST', 'PUT', 'PATCH'].includes(method)) {
        config.data = body;
      }

      const response = await apiClient.request(config);
      return handleApiResponse(response);
    } catch (error: any) {
      return handleApiError(error);
    }
  };

  // Métodos de conveniencia para facilitar el uso
  const get = (url: string, headers?: Record<string, string>) => request('GET', url, headers);

  const post = (url: string, body?: any, headers?: Record<string, string>) =>
    request('POST', url, headers, body);

  const put = (url: string, body?: any, headers?: Record<string, string>) =>
    request('PUT', url, headers, body);

  const patch = (url: string, body?: any, headers?: Record<string, string>) =>
    request('PATCH', url, headers, body);

  const del = (url: string, headers?: Record<string, string>) => request('DELETE', url, headers);

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    sessionStatus: status,
    session,
  };
};
