import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, handleApiResponse, handleApiError } from '../lib/apiClient';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  nombre: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: Date;
}

interface ApiResponse {
  alert: string;
  data?: any;
  message?: string;
}

export const useAuthActions = () => {
  const { login: setSession, logout: clearSession, status, session } = useAuth();
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginCredentials): Promise<ApiResponse> => {
    try {
      setLoading(true);

      const response = await apiClient.post('/auth/login', credentials);

      if (response.data.user && response.data.backendTokens) {
        // Guardar la sesión usando el contexto
        await setSession({
          user: response.data.user,
          backendTokens: response.data.backendTokens,
        });

        return {
          alert: 'success',
          data: response.data,
          message: 'Login exitoso',
        };
      } else {
        return {
          alert: 'error',
          message: 'Respuesta inválida del servidor',
        };
      }
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<ApiResponse> => {
    try {
      setLoading(true);

      // Llamar al endpoint de logout si existe
      if (session?.backendTokens?.accessToken) {
        try {
          await apiClient.post(
            '/auth/logout',
            {},
            {
              headers: {
                Authorization: `Bearer ${session.backendTokens.accessToken}`,
              },
            }
          );
        } catch (error) {
          // Si falla el logout en el servidor, continuamos con el logout local
          console.warn('Error en logout del servidor:', error);
        }
      }

      // Limpiar sesión local
      await clearSession();

      return {
        alert: 'success',
        message: 'Sesión cerrada correctamente',
      };
    } catch (error: any) {
      return {
        alert: 'error',
        message: error.message || 'Error al cerrar sesión',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<ApiResponse> => {
    try {
      setLoading(true);

      const response = await apiClient.post('/auth/register', userData);

      if (response.data) {
        return {
          alert: 'success',
          data: response.data,
          message: 'Registro exitoso',
        };
      } else {
        return {
          alert: 'error',
          message: 'Error en el registro',
        };
      }
    } catch (error: any) {
      return handleApiError(error);
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async (): Promise<ApiResponse> => {
    try {
      if (!session?.backendTokens?.refreshToken) {
        throw new Error('No hay refresh token disponible');
      }

      const response = await apiClient.post('/auth/refresh', {
        refreshToken: session.backendTokens.refreshToken,
      });

      if (response.data.backendTokens) {
        // Actualizar tokens en la sesión
        await setSession({
          user: session.user,
          backendTokens: response.data.backendTokens,
        });

        return {
          alert: 'success',
          data: response.data.backendTokens,
          message: 'Token renovado exitosamente',
        };
      } else {
        // Si falla el refresh, cerrar sesión
        await clearSession();
        return {
          alert: 'error',
          message: 'Error al renovar token',
        };
      }
    } catch (error: any) {
      await clearSession();
      return handleApiError(error);
    }
  };

  return {
    login,
    register,
    logout,
    refreshToken,
    loading,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    user: session?.user || null,
  };
};
