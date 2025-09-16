/* eslint-disable react-hooks/exhaustive-deps */
// SocketContext.tsx - Adaptado para React Native
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { urlBackend_Client } from '@/routes/user.routes';
import { useAuth } from './AuthContext';

// Crear un contexto para el socket
const SocketContext = createContext<Socket | null>(null);

// Hook para usar el contexto del socket
export const useSocket = () => {
    return useContext(SocketContext);
};

// Definir el tipo de las propiedades de SocketProvider
interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { session } = useAuth();

    useEffect(() => {
        if (socket) {
            // 🔴 Cerrar la conexión actual antes de crear una nueva
            socket.disconnect();
        }

        // Determinar el ID del usuario (igual que en web)
        const idUser = session?.user?.id === "" ? "invitado" : session?.user?.id || "invitado";
        console.log('Conectando socket para usuario:', idUser);

        // 🟢 Crear nueva conexión (siempre se conecta, autenticado o no)
        const newSocket = io(urlBackend_Client, {
            path: "/socket",
            query: { id: idUser },
            // Configuraciones adicionales para React Native
            transports: ['websocket', 'polling'],
            timeout: 20000,
            forceNew: true
        });

        setSocket(newSocket);

        return () => {
            // 🔴 Cerrar la conexión cuando el componente se desmonte o `user` cambie
            newSocket.disconnect();
        };
    }, [session]); // Se ejecuta cuando `session` cambia (igual que en web)

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
