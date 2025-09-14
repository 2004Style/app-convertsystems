// Ejemplos de uso del sistema de autenticación con Axios

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useAuth, useUser, useTokens } from '@/contexts/AuthContext';
import { useCosultaApi } from '@/hooks/datosApi.hook';

// 1. Ejemplo de Login
export const LoginExample = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, isAuthenticated } = useAuthActions();

    const handleLogin = async () => {
        try {
            const result = await login({
                username: email,
                password: password,
            });

            if (result.alert === 'success') {
                Alert.alert('Éxito', 'Login exitoso');
            } else {
                Alert.alert('Error', result.message || 'Error en el login');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión');
        }
    };

    if (isAuthenticated) {
        return (
            <View style={{ padding: 20 }}>
                <Text>Usuario ya autenticado ✅</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Iniciar Sesión</Text>

            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 5
                }}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 5
                }}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#007AFF',
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center'
                }}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// 3. Ejemplo de perfil de usuario
export const UserProfileExample = () => {
    const user = useUser();
    const tokens = useTokens();
    const { status } = useAuth();

    if (status === 'loading') {
        return (
            <View style={{ padding: 20 }}>
                <Text>Cargando...</Text>
            </View>
        );
    }

    if (!user) {
        return (
            <View style={{ padding: 20 }}>
                <Text>Usuario no autenticado</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Perfil de Usuario</Text>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Nombre:</Text>
                <Text>{user.nombre} {user.apellidos}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Email:</Text>
                <Text>{user.correo}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Rol:</Text>
                <Text>{user.roles.nombre}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Teléfono:</Text>
                <Text>{user.telefono || 'No especificado'}</Text>
            </View>

            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>Verificado:</Text>
                <Text>{user.verificado ? '✅ Sí' : '❌ No'}</Text>
            </View>

            {tokens && (
                <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0' }}>
                    <Text style={{ fontWeight: 'bold' }}>Token expira:</Text>
                    <Text>{new Date(tokens.expiresIn).toLocaleString()}</Text>
                </View>
            )}
        </View>
    );
};

// 4. Ejemplo de consultas API con Axios
export const ApiExample = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { request, sessionStatus } = useCosultaApi();

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const response = await request(
                'GET',
                '/users/profile' // URL relativa, ya que la base está en apiClient
            );

            if (response.alert === 'success') {
                setUserData(response.data);
                Alert.alert('Éxito', 'Datos cargados correctamente');
            } else {
                Alert.alert('Error', response.message || 'Error al cargar datos');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    const createPost = async () => {
        setLoading(true);
        try {
            const response = await request(
                'POST',
                '/posts',
                {}, // headers adicionales si necesitas
                {
                    title: 'Mi nuevo post',
                    content: 'Contenido del post creado con Axios'
                }
            );

            if (response.alert === 'success') {
                Alert.alert('Éxito', 'Post creado correctamente');
            } else {
                Alert.alert('Error', response.message || 'Error al crear post');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Consultas API</Text>

            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#007AFF',
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center',
                    marginBottom: 10
                }}
                onPress={fetchUserData}
                disabled={loading}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {loading ? 'Cargando...' : 'Cargar datos del usuario'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#28a745',
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center',
                    marginBottom: 20
                }}
                onPress={createPost}
                disabled={loading}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {loading ? 'Creando...' : 'Crear post'}
                </Text>
            </TouchableOpacity>

            {userData && (
                <View style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
                    <Text style={{ fontWeight: 'bold' }}>Datos recibidos:</Text>
                    <Text>{JSON.stringify(userData, null, 2)}</Text>
                </View>
            )}

            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Estado de sesión:</Text>
                <Text>{sessionStatus}</Text>
            </View>
        </View>
    );
};

// 5. Ejemplo de logout
export const LogoutExample = () => {
    const { logout, loading, isAuthenticated } = useAuthActions();

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.alert === 'success') {
                Alert.alert('Éxito', 'Sesión cerrada correctamente');
            } else {
                Alert.alert('Error', result.message || 'Error al cerrar sesión');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión');
        }
    };

    if (!isAuthenticated) {
        return (
            <View style={{ padding: 20 }}>
                <Text>No hay sesión activa</Text>
            </View>
        );
    }

    return (
        <View style={{ padding: 20 }}>
            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#dc3545',
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center'
                }}
                onPress={handleLogout}
                disabled={loading}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// 6. Ejemplo de refresh token automático
export const RefreshTokenExample = () => {
    const { refreshToken, loading } = useAuthActions();
    const tokens = useTokens();

    const handleRefreshToken = async () => {
        try {
            const result = await refreshToken();
            if (result.alert === 'success') {
                Alert.alert('Éxito', 'Token renovado exitosamente');
            } else {
                Alert.alert('Error', result.message || 'Error al renovar token');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión');
        }
    };

    const isTokenExpiringSoon = () => {
        if (!tokens) return false;
        const now = Date.now();
        const timeUntilExpiry = tokens.expiresIn - now;
        const fiveMinutes = 5 * 60 * 1000; // 5 minutos en ms
        return timeUntilExpiry < fiveMinutes;
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, marginBottom: 20 }}>Gestión de Tokens</Text>

            {tokens && (
                <View style={{ marginBottom: 20 }}>
                    <Text>Token expira: {new Date(tokens.expiresIn).toLocaleString()}</Text>
                    {isTokenExpiringSoon() && (
                        <Text style={{ color: 'red', fontWeight: 'bold' }}>
                            ⚠️ Token expira pronto
                        </Text>
                    )}
                </View>
            )}

            <TouchableOpacity
                style={{
                    backgroundColor: loading ? '#ccc' : '#ffc107',
                    padding: 15,
                    borderRadius: 5,
                    alignItems: 'center'
                }}
                onPress={handleRefreshToken}
                disabled={loading || !tokens}
            >
                <Text style={{ color: 'black', fontWeight: 'bold' }}>
                    {loading ? 'Renovando...' : 'Renovar Token'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// Componente principal que muestra todos los ejemplos
export const AuthExamplesDemo = () => {
    const [activeExample, setActiveExample] = useState('login');
    const { isAuthenticated } = useAuthActions();

    const examples = [
        { key: 'login', label: 'Login', component: LoginExample },
        { key: 'profile', label: 'Perfil', component: UserProfileExample },
        { key: 'api', label: 'API', component: ApiExample },
        { key: 'logout', label: 'Logout', component: LogoutExample },
        { key: 'refresh', label: 'Refresh Token', component: RefreshTokenExample },
    ];

    const ActiveComponent = examples.find(ex => ex.key === activeExample)?.component || LoginExample;

    return (
        <View style={{ flex: 1 }}>
            {/* Navegación */}
            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#ccc'
            }}>
                {examples.map((example) => (
                    <TouchableOpacity
                        key={example.key}
                        style={{
                            padding: 8,
                            margin: 4,
                            backgroundColor: activeExample === example.key ? '#007AFF' : '#f0f0f0',
                            borderRadius: 5
                        }}
                        onPress={() => setActiveExample(example.key)}
                    >
                        <Text style={{
                            color: activeExample === example.key ? 'white' : 'black',
                            fontSize: 12
                        }}>
                            {example.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Estado de autenticación */}
            <View style={{
                padding: 10,
                backgroundColor: isAuthenticated ? '#d4edda' : '#f8d7da'
            }}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Estado: {isAuthenticated ? '🟢 Autenticado' : '🔴 No autenticado'}
                </Text>
            </View>

            {/* Componente activo */}
            <View style={{ flex: 1 }}>
                <ActiveComponent />
            </View>
        </View>
    );
};