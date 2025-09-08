# ConvertSystems App

Una aplicación móvil integral desarrollada con [React Native](https://reactnative.dev/), [Expo](https://expo.dev/) y [React Native Reusables](https://reactnativereusables.com) para soluciones digitales empresariales.

## 📱 Características de la Aplicación

- 🔐 **Sistema de Autenticación**: Registro e inicio de sesión completos
- 👤 **Gestión de Perfil**: Administración de información personal
- 🛒 **Compras y Favoritos**: Sistema completo de compras y wishlist
- 🔔 **Notificaciones**: Centro de notificaciones en tiempo real
- ⚙️ **Configuraciones**: Personalización completa de la aplicación
- 📱 **Responsive Design**: Optimizado para móvil con safe areas
- 🌙 **Modo Oscuro**: Soporte completo para tema claro/oscuro

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clonar el repositorio
git clone https://github.com/2004Style/app-convertsystems.git
cd app-convertsystems

# Instalar dependencias
pnpm install
# o
npm install
```

### 2. Ejecutar la aplicación

```bash
# Desarrollo web
pnpm run web

# Desarrollo móvil (requiere Expo Go)
pnpm run dev

# Comandos específicos
pnpm run ios     # iOS (Solo Mac)
pnpm run android # Android
```

### 3. Abrir la aplicación

- **Web**: Abre automáticamente en `http://localhost:8081`
- **Móvil**: Escanea el código QR con [Expo Go](https://expo.dev/go)
- **Simuladores**: Presiona `i` (iOS) o `a` (Android) en la terminal

## 📂 Estructura del Proyecto

```
app-convertsystems/
├── app/                          # Páginas de la aplicación (Expo Router)
│   ├── _layout.tsx              # Layout raíz con SafeAreaProvider
│   ├── index.tsx                # Página principal/bienvenida
│   ├── sign-in-form.tsx         # Formulario de inicio de sesión
│   ├── sing-up-form.tsx         # Formulario de registro
│   ├── profile.tsx              # Perfil del usuario
│   ├── purchases.tsx            # Historial de compras
│   ├── favorites.tsx            # Productos favoritos
│   ├── notifications.tsx        # Centro de notificaciones
│   └── settings.tsx             # Configuraciones
├── components/
│   ├── navigation/              # Sistema de navegación
│   │   ├── app-layout.tsx       # Layout principal con safe areas
│   │   ├── header.tsx           # Barra de navegación superior
│   │   └── side-menu.tsx        # Menú lateral
│   ├── ui/                      # Componentes UI reutilizables
│   └── *.tsx                    # Componentes específicos (forms, etc.)
├── lib/
│   ├── theme.ts                 # Configuración de temas
│   └── utils.ts                 # Utilidades y helpers
├── hooks/                       # Hooks personalizados
│   └── register.hook.ts         # Hook para registro de usuarios
└── routes/                      # Configuración de rutas backend
    ├── auth.routes.ts
    ├── products.routes.ts
    └── profile.routes.ts
```

## 🔧 Cómo Agregar una Nueva Página

### Paso 1: Crear el archivo de la página

Crea un nuevo archivo en la carpeta `app/` siguiendo la convención de Expo Router:

```bash
# Ejemplo: Crear página de productos
touch app/products.tsx
```

### Paso 2: Estructura básica de la página

```tsx
// app/products.tsx
import { AppLayout } from '@/components/navigation/app-layout';
import { Text } from '@/components/ui/text';
import { Stack } from 'expo-router';
import { ScrollView } from 'react-native';

export default function ProductsScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AppLayout title="Productos">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, padding: 16 }}
          showsVerticalScrollIndicator={false}>
          <Text>Contenido de productos aquí</Text>
        </ScrollView>
      </AppLayout>
    </>
  );
}
```

### Paso 3: Agregar al menú lateral

Edita `components/navigation/side-menu.tsx` para incluir la nueva página:

```tsx
// Importar el icono necesario
import { Package } from 'lucide-react-native';

// Agregar el MenuItem en la sección correspondiente
<MenuItem icon={Package} title="Productos" onPress={() => navigateAndClose('/products')} />;
```

### Paso 4: (Opcional) Configurar rutas backend

Si la página necesita conectarse al backend, crea/edita el archivo de rutas correspondiente:

```typescript
// routes/products.routes.ts
const PRODUCTS_ROUTES = {
  GET_ALL: `${URL_API}/products`,
  GET_BY_ID: (id: string) => `${URL_API}/products/${id}`,
  CREATE: `${URL_API}/products`,
  // ...más rutas
};

export default PRODUCTS_ROUTES;
```

## 🎨 Personalización de UI

### Componentes disponibles

```bash
# Ver componentes disponibles
npx react-native-reusables/cli@latest add

# Agregar componentes específicos
npx react-native-reusables/cli@latest add dialog sheet tabs
```

### Temas y colores

Edita `lib/theme.ts` para personalizar:

- Colores del tema claro/oscuro
- Esquemas de navegación
- Variables de diseño

### Safe Areas y Layout

El `AppLayout` maneja automáticamente:

- Safe areas (notch, dynamic island, barras de sistema)
- Altura dinámica de ventana (equivalente a `100dvh`)
- Orientación automática
- Menú lateral contextual

## 🔌 Integración Backend

### Variables de entorno

Configura las URLs en tu archivo `.env`:

```env
EXPO_PUBLIC_URL_BACKEND=https://tu-backend.com
EXPO_PUBLIC_URL_API=https://tu-backend.com/api
EXPO_PUBLIC_URL_BOT=https://tu-bot.com
```

### Hooks personalizados

Los hooks en `hooks/` manejan la lógica de negocio:

- `register.hook.ts`: Registro de usuarios
- Agrega más hooks según necesites

## 📱 Optimizaciones Móviles

### KeyboardAvoidingView

Los formularios usan `KeyboardAvoidingView` automáticamente:

```tsx
<KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
>
```

### ScrollView optimizado

Usa este patrón para listas scrolleables:

```tsx
<ScrollView
    className="flex-1"
    contentContainerStyle={{ flexGrow: 1, padding: 16 }}
    showsVerticalScrollIndicator={false}
>
```

## 🚀 Deployment

### EAS Build (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Configurar proyecto
eas build:configure

# Build para desarrollo
eas build --platform all --profile development

# Build para producción
eas build --platform all --profile production
```

### Web Deployment

```bash
# Build para web
npx expo export -p web

# Los archivos estáticos estarán en /dist
```

## 🛠️ Scripts Disponibles

| Comando            | Descripción            |
| ------------------ | ---------------------- |
| `pnpm run dev`     | Servidor de desarrollo |
| `pnpm run web`     | Desarrollo web         |
| `pnpm run ios`     | iOS simulator (Mac)    |
| `pnpm run android` | Android emulator       |
| `pnpm run build`   | Build para producción  |
| `pnpm run lint`    | Linting del código     |

## 📚 Recursos Útiles

- [Expo Router Docs](https://expo.dev/router) - Sistema de navegación
- [NativeWind Docs](https://www.nativewind.dev/) - Styling con Tailwind
- [React Native Reusables](https://reactnativereusables.com) - Componentes UI
- [Lucide React Native](https://lucide.dev/) - Iconos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

⭐ Si te gusta este proyecto, ¡dale una estrella en [GitHub](https://github.com/2004Style/app-convertsystems)!
