# Hook useCosultaApi - Guía de Uso

## Descripción

El hook `useCosultaApi` es la forma recomendada de hacer peticiones HTTP en la aplicación. Incluye automáticamente:

- ✅ **Refresh automático de tokens** cuando expiran (error 401)
- ✅ **Manejo automático de autenticación** con Bearer tokens
- ✅ **Detección de rutas públicas** (no requieren autenticación)
- ✅ **Manejo de errores** consistente
- ✅ **Métodos de conveniencia** para GET, POST, PUT, PATCH, DELETE

## Importación

```typescript
import { useCosultaApi, MensajeError } from '../hooks/datosApi.hook';
```

## Uso Básico

### 1. Petición GET

```typescript
const MiComponente = () => {
  const { get } = useCosultaApi();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarProductos = async () => {
    setLoading(true);
    const response = await get('/productos');

    if (response.alert === 'success') {
      setProductos(response.data);
    } else {
      console.error('Error:', response.message);
    }
    setLoading(false);
  };

  return (
    <View>
      <Button title="Cargar Productos" onPress={cargarProductos} />
      {loading && <Text>Cargando...</Text>}
      {/* Renderizar productos */}
    </View>
  );
};
```

### 2. Petición POST

```typescript
const { post } = useCosultaApi();

const crearProducto = async (datos) => {
  const response = await post('/productos', datos);

  if (response.alert === 'success') {
    console.log('Producto creado:', response.data);
  } else {
    alert(MensajeError(response.message));
  }
};
```

### 3. Petición PUT/PATCH

```typescript
const { put, patch } = useCosultaApi();

const actualizarProducto = async (id, datos) => {
  const response = await put(`/productos/${id}`, datos);
  // o usar patch para actualizaciones parciales
  // const response = await patch(`/productos/${id}`, datos);

  if (response.alert === 'success') {
    console.log('Producto actualizado');
  }
};
```

### 4. Petición DELETE

```typescript
const { delete: deleteRequest } = useCosultaApi();

const eliminarProducto = async (id) => {
  const response = await deleteRequest(`/productos/${id}`);

  if (response.alert === 'success') {
    console.log('Producto eliminado');
  }
};
```

### 5. Uso del método request genérico

```typescript
const { request } = useCosultaApi();

const hacerPeticion = async () => {
  const response = await request(
    'POST',
    '/productos',
    { 'Custom-Header': 'valor' }, // headers personalizados
    { nombre: 'Producto', precio: 100 } // body
  );
};
```

## Respuesta de la API

Todas las peticiones devuelven un objeto con la siguiente estructura:

```typescript
interface ApiResponse {
  alert: 'success' | 'error' | 'warning';
  data?: any;
  message?: string;
}
```

### Ejemplo de manejo de respuestas:

```typescript
const { get } = useCosultaApi();

const manejarRespuesta = async () => {
  const response = await get('/productos');

  switch (response.alert) {
    case 'success':
      console.log('Datos:', response.data);
      break;
    case 'error':
      console.error('Error:', response.message);
      break;
    case 'warning':
      console.warn('Advertencia:', response.message);
      break;
  }
};
```

## Estados de Sesión

El hook también proporciona información sobre el estado de la sesión:

```typescript
const { sessionStatus, session, get } = useCosultaApi();

// sessionStatus puede ser: 'loading' | 'authenticated' | 'unauthenticated'
// session contiene los datos del usuario y tokens

if (sessionStatus === 'loading') {
  return <Text>Cargando sesión...</Text>;
}

if (sessionStatus === 'unauthenticated') {
  return <Text>Por favor inicia sesión</Text>;
}

// Usuario autenticado, hacer peticiones normalmente
```

## Manejo de Errores con MensajeError

La función `MensajeError` normaliza los mensajes de error de diferentes formatos:

```typescript
import { MensajeError } from '../hooks/datosApi.hook';

const { post } = useCosultaApi();

const enviarDatos = async () => {
  const response = await post('/datos', { info: 'test' });

  if (response.alert === 'error') {
    const errorFormateado = MensajeError(response.message);
    alert(errorFormateado); // Mensaje limpio y legible
  }
};
```

## Rutas Públicas

Para rutas públicas (que no requieren autenticación), el hook detecta automáticamente si la ruta actual es pública usando `isPublicRoute()` y no agrega tokens de autorización.

## Beneficios del Refresh Automático

- **Transparente**: Los tokens se refrescan automáticamente sin que el usuario lo note
- **Sin interrupciones**: Las peticiones se reintientan automáticamente con el nuevo token
- **Seguro**: Si el refresh falla, la sesión se limpia automáticamente
- **Eficiente**: Múltiples peticiones durante un refresh se ponen en cola y se procesan juntas

## Ejemplo Completo

```typescript
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useCosultaApi, MensajeError } from '../hooks/datosApi.hook';

export const ProductosScreen = () => {
  const { get, post, delete: deleteRequest, sessionStatus } = useCosultaApi();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  const cargarProductos = async () => {
    setLoading(true);
    const response = await get('/productos');

    if (response.alert === 'success') {
      setProductos(response.data);
    } else {
      alert(MensajeError(response.message));
    }
    setLoading(false);
  };

  const crearProducto = async () => {
    const response = await post('/productos', {
      nombre: 'Producto Nuevo',
      precio: 99.99
    });

    if (response.alert === 'success') {
      cargarProductos(); // Recargar lista
    } else {
      alert(MensajeError(response.message));
    }
  };

  const eliminarProducto = async (id) => {
    const response = await deleteRequest(`/productos/${id}`);

    if (response.alert === 'success') {
      cargarProductos(); // Recargar lista
    } else {
      alert(MensajeError(response.message));
    }
  };

  useEffect(() => {
    if (sessionStatus === 'authenticated') {
      cargarProductos();
    }
  }, [sessionStatus]);

  if (sessionStatus === 'loading') {
    return <Text>Cargando sesión...</Text>;
  }

  if (sessionStatus === 'unauthenticated') {
    return <Text>Por favor inicia sesión</Text>;
  }

  return (
    <View>
      <Button title="Crear Producto" onPress={crearProducto} />
      <Button title="Recargar" onPress={cargarProductos} />

      {loading && <Text>Cargando...</Text>}

      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.nombre}</Text>
            <Button
              title="Eliminar"
              onPress={() => eliminarProducto(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};
```

## Notas Importantes

- El hook detecta automáticamente si necesita tokens basándose en la ruta actual
- Los tokens se refrescan automáticamente cuando expiran (error 401)
- Las peticiones fallidas se reintentan automáticamente después del refresh
- Si el refresh token también expira, la sesión se cierra automáticamente
- Siempre usar `MensajeError()` para mostrar mensajes de error al usuario
