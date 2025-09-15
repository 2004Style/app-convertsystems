# Configuración de Registro con FormData

## Cambios Implementados

### ✅ **1. Interface LoginCredentials corregida**

```typescript
interface LoginCredentials {
  username: string; // ← Correcto: username en lugar de correo
  password: string; // ← Correcto: password en lugar de contrasena
}
```

### ✅ **2. Función de registro con FormData + Axios directo**

```typescript
// hooks/useAuthActions.ts
const register = async (userData: RegisterData): Promise<ApiResponse> => {
  const formData = new FormData();

  // Campos de texto
  formData.append('nombre', userData.nombre);
  formData.append('apellidos', userData.apellidos);
  formData.append('correo', userData.correo);
  formData.append('contrasena', userData.contrasena);
  formData.append('telefono', userData.telefono || '');
  formData.append('direccion', userData.direccion || '');

  // Fecha formateada como YYYY-MM-DD
  if (userData.fecha_nacimiento) {
    const fecha = userData.fecha_nacimiento.toISOString().split('T')[0];
    formData.append('fecha_nacimiento', fecha);
  }

  // Imagen si existe
  if (userData.perfil) {
    formData.append('perfil', {
      uri: userData.perfil,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);
  }

  // ⚠️ IMPORTANTE: Usa axios DIRECTO, no el apiClient
  const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/register`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'X-Forwarded-Proto': 'https',
    },
    timeout: 30000, // 30s para upload de imagen
  });
};
```

### ✅ **3. Interface RegisterData actualizada**

```typescript
interface RegisterData {
  nombre: string;
  apellidos: string;
  correo: string;
  contrasena: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: Date;
  perfil?: string; // ← Nueva: URI de la imagen
}
```

### ✅ **4. Hook useRegisterForm actualizado**

```typescript
// Acepta imagen como segundo parámetro
const onSubmit = async (data: FormData, imageUri?: string) => {
  const registerData = {
    ...data,
    perfil: imageUri, // ← Pasar la imagen al hook
  };

  const result = await register(registerData);
};
```

### ✅ **5. Componente SignUpForm actualizado**

```typescript
// Conecta imagen con el hook
const handleSubmit = formHandleSubmit((data) => onSubmit(data, previewUrl));

// Muestra estado de carga
<Button disabled={loading}>
  <Text>{loading ? 'Registrando...' : 'Continue'}</Text>
</Button>
```

### ✅ **6. Componente SignInForm actualizado**

```typescript
// Estados correctos
const [username, setUsername] = useState(''); // ← username
const [password, setPassword] = useState(''); // ← password

// Envío correcto
const result = await login({
  username: username, // ← Usa username
  password: password, // ← Usa password
});
```

## Estructura del FormData que se envía

```bash
# Equivalente al curl que funciona en la API
curl -X POST https://api.convertsystems.store/auth/register \
  -F "nombre=Juan" \
  -F "apellidos=Pérez" \
  -F "correo=juan@example.com" \
  -F "telefono=+1234567890" \
  -F "direccion=Calle 123" \
  -F "fecha_nacimiento=1990-01-01" \
  -F "contrasena=password123" \
  -F "perfil=@/path/to/image.jpg"
```

## Variables de entorno necesarias

```env
EXPO_PUBLIC_API_URL=https://api.convertsystems.store
```

## Diferencias clave

### ❌ **Antes (Incorrecto)**

- Login usaba `correo` y `contrasena`
- Registro enviaba JSON
- Usaba el hook de consultas para registro
- No soportaba imágenes

### ✅ **Ahora (Correcto)**

- Login usa `username` y `password`
- Registro envía FormData con `multipart/form-data`
- Usa axios directo para registro (sin pasar por apiClient)
- Soporta imágenes de perfil
- Timeout extendido (30s) para subida de archivos

## Testing

### 1. **Test de Login**

```typescript
// En cualquier componente
const { login } = useAuthActions();

const testLogin = async () => {
  const result = await login({
    username: 'admin@cs.dev',
    password: 'tu_password',
  });
  console.log(result);
};
```

### 2. **Test de Registro**

```typescript
// En cualquier componente
const { register } = useAuthActions();

const testRegister = async () => {
  const result = await register({
    nombre: 'Test',
    apellidos: 'User',
    correo: 'test@example.com',
    contrasena: 'password123',
    telefono: '123456789',
    direccion: 'Test Address',
    fecha_nacimiento: new Date('1990-01-01'),
    perfil: 'file:///path/to/image.jpg', // URI de imagen opcional
  });
  console.log(result);
};
```

## Headers enviados para registro

```typescript
{
  'Content-Type': 'multipart/form-data',
  'X-Forwarded-Proto': 'https',
}
```

## Manejo de errores

El registro ahora maneja 3 tipos de errores:

1. **Error del servidor** (response): Muestra `error.response.data.message`
2. **Error de red** (request): Muestra "Error de conexión"
3. **Error desconocido**: Muestra `error.message`

## Logs para debugging

```typescript
// En useAuthActions.ts línea ~95
console.error('Error en registro:', error);
```

Revisa la consola para ver detalles del error si el registro falla.
