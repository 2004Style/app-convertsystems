# Debug Guide - Registro con FormData

## Error 500 - Análisis y Soluciones

### Cambios implementados para solucionar el error:

#### 1. **Content-Type automático**

```typescript
// ❌ Antes (problemático)
headers: {
  'Content-Type': 'multipart/form-data', // Esto NO incluye boundary
}

// ✅ Ahora (correcto)
headers: {
  // Axios establece automáticamente: 'multipart/form-data; boundary=...'
  'X-Forwarded-Proto': 'https',
}
```

#### 2. **Campos opcionales mejorados**

```typescript
// ✅ Solo enviar campos con valor
if (userData.telefono && userData.telefono.trim() !== '') {
  formData.append('telefono', userData.telefono);
}
```

#### 3. **Validación Zod actualizada**

```typescript
// ✅ Campos opcionales más flexibles
telefono: z.string().optional().refine(...),
direccion: z.string().optional().refine(...),
```

#### 4. **Mejor manejo de errores**

```typescript
console.error('Error response:', error.response?.data);
console.error('Error status:', error.response?.status);
```

## Testing Manual

### 1. **Test básico sin imagen**

```typescript
const testData = {
  nombre: 'Test',
  apellidos: 'Usuario',
  correo: 'test@example.com',
  contrasena: 'password123',
  fecha_nacimiento: new Date('1990-01-01'),
  // Sin telefono, direccion ni perfil
};
```

### 2. **Test completo con todos los campos**

```typescript
const testData = {
  nombre: 'Test',
  apellidos: 'Usuario',
  correo: 'test@example.com',
  contrasena: 'password123',
  telefono: '123456789',
  direccion: 'Calle Test 123',
  fecha_nacimiento: new Date('1990-01-01'),
  perfil: 'file:///path/to/image.jpg',
};
```

## Logs a revisar en consola

Después de intentar registrarse, revisa estos logs:

```bash
# 1. Datos preparados
FormData preparado para envío: {
  nombre: "Test",
  apellidos: "Usuario",
  correo: "test@example.com",
  telefono: "[no enviado]", # o el valor
  direccion: "[no enviado]", # o el valor
  hasImage: false,
  url: "https://api.convertsystems.store/auth/register"
}

# 2. Request enviado
Enviando request a: https://api.convertsystems.store/auth/register

# 3. Si hay error:
Error en registro: [detalles del error]
Error response: [respuesta del servidor]
Error status: 500
```

## Posibles causas del error 500

### 1. **Campo requerido faltante en el servidor**

- El servidor espera un campo que no estás enviando
- Verifica que todos los campos requeridos estén presentes

### 2. **Formato de fecha incorrecto**

```typescript
// Enviamos: "1990-01-01" (YYYY-MM-DD)
// ¿El servidor espera otro formato?
```

### 3. **Validación del servidor fallando**

- Email ya existe
- Contraseña no cumple requisitos del servidor
- Teléfono en formato incorrecto

### 4. **Problema con la imagen**

- Si envías imagen, el servidor puede tener problema procesándola
- Prueba sin imagen primero

## Debugging step-by-step

### Paso 1: Test sin campos opcionales

```typescript
// Solo campos mínimos requeridos
{
  nombre: "Test",
  apellidos: "User",
  correo: "test123@example.com", // Nuevo email
  contrasena: "password123",
  fecha_nacimiento: new Date('1990-01-01')
}
```

### Paso 2: Verificar variable de entorno

```typescript
console.log('EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
// Debe mostrar: https://api.convertsystems.store
```

### Paso 3: Test desde curl (comparación)

```bash
curl -X POST https://api.convertsystems.store/auth/register \
  -F "nombre=Test" \
  -F "apellidos=User" \
  -F "correo=test456@example.com" \
  -F "contrasena=password123" \
  -F "fecha_nacimiento=1990-01-01"
```

## Headers que se están enviando

```
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryCDWg5hGm0q2c0Fke
X-Forwarded-Proto: https
```

## Siguiente paso de debugging

1. **Revisa los logs en consola** después del error
2. **Prueba con datos mínimos** (sin telefono/direccion)
3. **Verifica que el email no exista** en el servidor
4. **Compara con curl exitoso** usando los mismos datos

Si el error persiste, el problema está en el servidor, no en el cliente.
