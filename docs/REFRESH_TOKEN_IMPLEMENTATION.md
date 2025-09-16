# Implementación de Refresh Automático de Tokens

## Resumen

Se ha implementado un sistema completo de refresh automático de tokens que mantiene la sesión del usuario activa sin requerir que se autentique nuevamente cuando el access token expira.

## Cambios Implementados

### 1. AuthContext.tsx - Mejoras en la gestión de sesiones

**Nuevas funciones agregadas:**

- `attemptTokenRefresh()`: Intenta refrescar el token usando el refresh token
- `refreshTokens()`: Función pública para refrescar tokens manualmente
- Modificación en `loadStoredSession()`: Ahora intenta refrescar tokens expirados antes de cerrar la sesión

**Beneficios:**

- ✅ Mantiene la sesión activa automáticamente
- ✅ Evita cerrar sesión por tokens expirados cuando hay un refresh token válido
- ✅ Proporciona funcionalidad manual de refresh para casos especiales

### 2. apiClient.ts - Interceptor inteligente para manejo de 401

**Nuevas características:**

- **Interceptor de respuesta**: Detecta automáticamente errores 401 (Unauthorized)
- **Queue system**: Maneja múltiples peticiones simultáneas durante el refresh
- **Retry automático**: Reintenta la petición original con el nuevo token
- **Fallback seguro**: Limpia la sesión si el refresh falla

**Flujo de trabajo:**

1. Se detecta un error 401 en cualquier petición
2. Se pausa la petición y se intenta refrescar el token
3. Si el refresh es exitoso, se reintenta la petición original
4. Si falla, se limpia la sesión y se redirige al login

### 3. useCosultaApi Hook - Mejorado con métodos de conveniencia

**Mejoras al hook existente:**

- **Métodos de conveniencia** agregados: `get()`, `post()`, `put()`, `patch()`, `delete()`
- **Integración completa** con el sistema de refresh automático
- **Compatibilidad total** con el código existente
- **Detección automática** de rutas públicas vs privadas

## Cómo usar el sistema mejorado

### 1. Uso básico con useCosultaApi (recomendado)

```tsx
import { useCosultaApi, MensajeError } from '../hooks/datosApi.hook';

const MiComponente = () => {
  const { get, post, sessionStatus } = useCosultaApi();
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    const response = await get('/productos'); // Token se agrega automáticamente

    if (response.alert === 'success') {
      setDatos(response.data);
    } else {
      alert(MensajeError(response.message));
    }
    setLoading(false);
  };

  return (
    <View>
      <Button title="Cargar" onPress={cargarDatos} />
      {loading && <Text>Cargando...</Text>}
    </View>
  );
};
```

### 2. Peticiones POST/PUT/DELETE

```tsx
const { post, put, delete: deleteRequest } = useCosultaApi();

// Crear recurso
const crear = async () => {
  const response = await post('/productos', {
    nombre: 'Nuevo Producto',
    precio: 100,
  });

  if (response.alert === 'success') {
    console.log('Creado:', response.data);
  }
};

// Actualizar recurso
const actualizar = async () => {
  const response = await put('/productos/123', {
    nombre: 'Producto Actualizado',
  });
};

// Eliminar recurso
const eliminar = async () => {
  const response = await deleteRequest('/productos/123');
};
```

### 3. Uso con el método request genérico

```tsx
const { request } = useCosultaApi();

const hacerPeticionPersonalizada = async () => {
  const response = await request(
    'PATCH',
    '/productos/123',
    { 'Custom-Header': 'valor' }, // headers personalizados
    { precio: 150 } // body
  );

  if (response.alert === 'success') {
    console.log('Actualizado:', response.data);
  }
};
```

### 4. Manejo de estados de sesión

```tsx
const { sessionStatus, session, get } = useCosultaApi();

// Verificar estado antes de hacer peticiones
if (sessionStatus === 'loading') {
  return <Text>Cargando sesión...</Text>;
}

if (sessionStatus === 'unauthenticated') {
  return <Text>Por favor inicia sesión</Text>;
}

// Usuario autenticado, proceder normalmente
```

## Ventajas del nuevo sistema

### 🔄 Refresh Automático

- Los tokens se refrescan automáticamente cuando expiran
- No interrumpe la experiencia del usuario
- Mantiene las sesiones activas por más tiempo

### 🛡️ Seguridad Mejorada

- Tokens de corta duración para mayor seguridad
- Refresh tokens de larga duración para conveniencia
- Limpieza automática de sesiones comprometidas

### 🔧 Facilidad de Uso

- Hook `useApi` simplifica las peticiones HTTP
- Manejo automático de tokens y errores
- Estados de loading y error incluidos

### 📦 Manejo de Errores Robusto

- Reintentos automáticos en errores 401
- Queue system para peticiones concurrentes
- Fallbacks seguros en casos de fallo

### 🎯 Compatibilidad

- Compatible con el código existente
- No requiere cambios en componentes actuales
- Mejora progresiva de la funcionalidad

## Configuración del Backend

Asegúrate de que tu backend tenga un endpoint `/auth/refresh` que:

```javascript
POST /auth/refresh
Body: { "refreshToken": "..." }
Response: {
  "data": {
    "accessToken": "nuevo_access_token",
    "refreshToken": "nuevo_refresh_token", // opcional
    "expiresIn": 1640995200000 // timestamp
  }
}
```

## Migración desde el código existente

## Migración desde el código existente

### Antes (usando fetch o axios directamente):

```tsx
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);

const cargarDatos = async () => {
  setLoading(true);
  try {
    const response = await fetch('/productos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    setData(result);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Después (usando useCosultaApi):

```tsx
const { get } = useCosultaApi();
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);

const cargarDatos = async () => {
  setLoading(true);
  const response = await get('/productos'); // Token automático, refresh automático

  if (response.alert === 'success') {
    setData(response.data);
  } else {
    console.error(MensajeError(response.message));
  }
  setLoading(false);
};
```

## ¿Por qué usar useCosultaApi en lugar de crear un hook nuevo?

### ✅ Ventajas de aprovechar el hook existente:

1. **Código existente funciona**: No hay que migrar componentes que ya usan `useCosultaApi`
2. **Menos duplicación**: Evitamos tener dos hooks que hacen lo mismo
3. **Mantenimiento simplificado**: Un solo hook que mantener y mejorar
4. **Integración nativa**: Ya detecta rutas públicas/privadas automáticamente
5. **Compatibilidad total**: Funciona con todo el código legacy sin cambios
6. **Refresh automático**: Ahora incluye refresh de tokens transparente

### 🔄 El hook mejorado ahora incluye:

- **Refresh automático**: Gracias al interceptor en `apiClient.ts`
- **Métodos de conveniencia**: `get()`, `post()`, `put()`, `patch()`, `delete()`
- **Manejo robusto de errores**: Con `MensajeError()` para formatear errores
- **Estados de sesión**: Acceso directo a `sessionStatus` y `session`
- **Detección automática**: De rutas públicas vs privadas

### 📚 Documentación adicional:

Para una guía completa de uso del hook mejorado, consulta:

- `docs/useCosultaApi-GUIDE.md` - Guía detallada con ejemplos

## Beneficios de Seguridad

1. **Tokens de corta duración**: Los access tokens expiran rápidamente, limitando el daño si son comprometidos
2. **Refresh automático**: Mantiene la sesión sin exponer credenciales frecuentemente
3. **Limpieza automática**: Sesiones comprometidas se limpian automáticamente
4. **No almacenamiento de credenciales**: Solo se almacenan tokens, nunca contraseñas

El sistema ahora maneja automáticamente la renovación de tokens, proporcionando una experiencia de usuario fluida mientras mantiene altos estándares de seguridad.
