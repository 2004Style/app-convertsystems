import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuarios, backendTokens } from '../interfaces/interfaces';

// Tipos para el contexto
interface User {
    id: string;
    Auth2Id: string | null;
    nombre: string;
    apellidos: string;
    correo: string;
    telefono: string | null;
    direccion: string | null;
    fecha_nacimiento: Date | null;
    urlPerfil: string | null;
    contrasena: string;
    rol_id: string;
    verificado: boolean;
    roles: {
        nombre: string;
    };
    suscripcion?: any;
}

interface AuthSession {
    user: User;
    backendTokens: backendTokens;
}

interface AuthContextType {
    session: AuthSession | null;
    status: 'loading' | 'authenticated' | 'unauthenticated';
    login: (sessionData: AuthSession) => Promise<void>;
    logout: () => Promise<void>;
    updateTokens: (tokens: backendTokens) => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Claves para AsyncStorage
const STORAGE_KEYS = {
    SESSION: '@app-convertsystems/session',
    USER: '@app-convertsystems/user',
    TOKENS: '@app-convertsystems/tokens',
};

// Provider del contexto
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [session, setSession] = useState<AuthSession | null>(null);
    const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

    // Cargar sesión desde AsyncStorage al inicializar
    useEffect(() => {
        loadStoredSession();
    }, []);

    const loadStoredSession = async (): Promise<void> => {
        try {
            setStatus('loading');

            const storedSession = await AsyncStorage.getItem(STORAGE_KEYS.SESSION);

            if (storedSession) {
                const parsedSession: AuthSession = JSON.parse(storedSession);

                // Verificar si el token no ha expirado
                const currentTime = Date.now();
                if (parsedSession.backendTokens.expiresIn > currentTime) {
                    setSession(parsedSession);
                    setStatus('authenticated');
                } else {
                    // Token expirado, limpiar sesión
                    await clearSession();
                    setStatus('unauthenticated');
                }
            } else {
                setStatus('unauthenticated');
            }
        } catch (error) {
            console.error('Error loading stored session:', error);
            setStatus('unauthenticated');
        }
    };

    const login = async (sessionData: AuthSession): Promise<void> => {
        try {
            // Guardar en AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
            await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionData.user));
            await AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(sessionData.backendTokens));

            // Actualizar estado
            setSession(sessionData);
            setStatus('authenticated');
        } catch (error) {
            console.error('Error saving session:', error);
            throw new Error('Error al guardar la sesión');
        }
    };

    const logout = async (): Promise<void> => {
        try {
            await clearSession();
            setSession(null);
            setStatus('unauthenticated');
        } catch (error) {
            console.error('Error during logout:', error);
            throw new Error('Error al cerrar sesión');
        }
    };

    const updateTokens = async (tokens: backendTokens): Promise<void> => {
        try {
            if (!session) {
                throw new Error('No hay sesión activa');
            }

            const updatedSession: AuthSession = {
                ...session,
                backendTokens: tokens,
            };

            // Actualizar AsyncStorage
            await AsyncStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
            await AsyncStorage.setItem(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));

            // Actualizar estado
            setSession(updatedSession);
        } catch (error) {
            console.error('Error updating tokens:', error);
            throw new Error('Error al actualizar tokens');
        }
    };

    const clearSession = async (): Promise<void> => {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.SESSION,
            STORAGE_KEYS.USER,
            STORAGE_KEYS.TOKENS,
        ]);
    };

    const value: AuthContextType = {
        session,
        status,
        login,
        logout,
        updateTokens,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};

// Hook adicional para obtener solo el usuario
export const useUser = () => {
    const { session } = useAuth();
    return session?.user || null;
};

// Hook adicional para obtener solo los tokens
export const useTokens = () => {
    const { session } = useAuth();
    return session?.backendTokens || null;
};