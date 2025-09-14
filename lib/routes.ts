// Configuración de rutas públicas para la aplicación
export const publicRoutes = [
  '/shop',
  '/test',
  '/tools',
  '/pruebas',
  '/sign-in-form',
  '/sing-up-form',
  '/', // ruta home pública
];

// Función para verificar si una ruta es pública
export const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some((route) => {
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  });
};

// Rutas que requieren autenticación
export const protectedRoutes = [
  '/profile',
  '/purchases',
  '/favorites',
  '/notifications',
  '/settings',
  '/pago',
];

// Función para verificar si una ruta requiere autenticación
export const isProtectedRoute = (pathname: string): boolean => {
  return protectedRoutes.some((route) => pathname.startsWith(route));
};
