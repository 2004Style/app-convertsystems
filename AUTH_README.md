# Sistema de Autenticación para React Native

Este sistema reemplaza `next-auth` y `next/navigation` por una solución nativa para React Native usando `AsyncStorage` y `expo-router`.

## Estructura

```
contexts/
  AuthContext.tsx          # Contexto principal de autenticación
hooks/
  useAuthActions.ts        # Hook para acciones de auth (login, logout, etc.)
  datosApi.hook.ts        # Hook para consultas API (refactorizado)
lib/
  routes.ts               # Configuración de rutas públicas/privadas
examples/
  auth-usage-examples.tsx # Ejemplos de uso
```

## Configuración inicial

1. **Variables de entorno**: Asegúrate de tener configurado `EXPO_PUBLIC_API_URL` en tu archivo `.env`

2. **Provider en el Layout**: Ya está configurado en `app/_layout.tsx`

```tsx
<AuthProvider>{/* Tu app */}</AuthProvider>
```

## Hooks disponibles

### 1. `useAuth()` - Contexto principal

```tsx
const { session, status } = useAuth();

// status: 'loading' | 'authenticated' | 'unauthenticated'
// session: { user, backendTokens } | null
```

### 2. `useUser()` - Solo datos del usuario

```tsx
const user = useUser();
// user: { id, nombre, apellidos, correo, ... } | null
```

### 3. `useTokens()` - Solo tokens

```tsx
const tokens = useTokens();
// tokens: { accessToken, refreshToken, expiresIn } | null
```

### 4. `useAuthActions()` - Acciones de autenticación

```tsx
const { login, register, logout, refreshToken, loading, isAuthenticated, user } = useAuthActions();
```

### 5. `useCosultaApi()` - Consultas API (refactorizado)

```tsx
const { request, sessionStatus, session } = useCosultaApi();

const response = await request('GET', '/api/endpoint');
```

## Flujo de autenticación

### Login

```tsx
const result = await login({
  correo: 'usuario@email.com',
  contrasena: 'password123',
});

if (result.alert === 'success') {
  // Usuario autenticado
  // La sesión se guarda automáticamente en AsyncStorage
}
```

### Respuesta esperada del servidor

```json
{
  "user": {
    "id": "uuid",
    "nombre": "Ronald",
    "apellidos": "Chavez",
    "correo": "admin@cs.dev",
    "telefono": "1234567890",
    "direccion": "Calle Falsa 123",
    "fecha_nacimiento": "2025-06-15T00:45:20.765Z",
    "urlPerfil": "/logo.png",
    "rol_id": "uuid",
    "Auth2Id": null,
    "verificado": true,
    "roles": {
      "nombre": "admin"
    },
    "suscripcion": null
  },
  "backendTokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token",
    "expiresIn": 1757806063008
  }
}
```

### Logout

```tsx
const result = await logout();
// Limpia AsyncStorage y el estado de la app
```

### Consultas API

```tsx
// Para rutas protegidas (automáticamente incluye tokens)
const response = await request('GET', '/api/protected-endpoint');

// Para rutas públicas (no requiere autenticación)
const response = await request('GET', '/api/public-endpoint');
```

## Rutas públicas vs protegidas

Configuradas en `lib/routes.ts`:

### Rutas públicas (no requieren autenticación)

- `/shop`
- `/test`
- `/tools`
- `/pruebas`
- `/sign-in-form`
- `/sing-up-form`
- `/` (home)

### Rutas protegidas (requieren autenticación)

- `/profile`
- `/purchases`
- `/favorites`
- `/notifications`
- `/settings`
- `/pago`

## Persistencia

La sesión se guarda automáticamente en AsyncStorage con las siguientes claves:

- `@app-convertsystems/session` - Sesión completa
- `@app-convertsystems/user` - Solo datos del usuario
- `@app-convertsystems/tokens` - Solo tokens

## Manejo de errores

Todas las funciones retornan un objeto `ApiResponse`:

```tsx
interface ApiResponse {
  alert: 'success' | 'error' | 'warning';
  data?: any;
  message?: string;
}
```

## Actualización de tokens

El hook `useAuthActions` incluye una función `refreshToken()` que automáticamente:

1. Usa el refresh token para obtener nuevos tokens
2. Actualiza la sesión en AsyncStorage
3. Si falla, cierra la sesión automáticamente

## Migración desde next-auth

### Antes

```tsx
import { useSession } from 'next-auth/react';
const { data: session, status } = useSession();
```

### Ahora

```tsx
import { useAuth } from '@/contexts/AuthContext';
const { session, status } = useAuth();
```

### Antes

```tsx
import { usePathname } from 'next/navigation';
```

### Ahora

```tsx
import { usePathname } from 'expo-router';
```

## Consideraciones importantes

1. **No usar `credentials: 'include'`** en React Native
2. **Variables de entorno** deben usar el prefijo `EXPO_PUBLIC_` para ser accesibles en el cliente
3. **Manejo de rutas** es diferente en expo-router vs next/router
4. **AsyncStorage** es asíncrono, todas las operaciones de persistencia usan await
