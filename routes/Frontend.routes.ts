// rutas de administrador
export const urlPaginasAdmin = "/admin";
export const AdCategorias = `${urlPaginasAdmin}/categoria`;
export const AdDiscord = `${urlPaginasAdmin}/discord`;
export const AdEstadisticas = `${urlPaginasAdmin}/estadisticas`;
export const AdNotificaciones = `${urlPaginasAdmin}/notificaciones`;
export const AdOfertas = `${urlPaginasAdmin}/ofertas`;
export const AdProductos = `${urlPaginasAdmin}/productos`;
export const AdRoles = `${urlPaginasAdmin}/roles`;
export const AdVersiones = `${urlPaginasAdmin}/versiones`;

// rutas de cliente
export const urlPaginasCliente = "/client";
const ClCompras = `${urlPaginasCliente}/compras`;
export const ClComprasProductos = `${ClCompras}/productos`;
export const ClComprasSuscripciones = `${ClCompras}/suscripciones`;
export const ClContacto = `${urlPaginasCliente}/contacto`;
const ClDetalles = `${urlPaginasCliente}/detalles`;
export const ClDetallesCompra = `${ClDetalles}/compra`;
export const ClDestallesNotificacion = `${ClDetalles}/notificacion`;
export const ClDetallesProducto = `${ClDetalles}/producto`;
export const ClFavoritos = `${urlPaginasCliente}/favoritos`;
const ClHistorial = `${urlPaginasCliente}/historial`;
export const ClHistorialCompras = `${ClHistorial}/compras`;
export const ClHistorialNotificaciones = `${ClHistorial}/notificaciones`;
export const ClPlanes = `${urlPaginasCliente}/planes`;
export const ClPerfil = `${urlPaginasCliente}/perfil`;

// rutas públicas
export const urlPaginasPublico = "";
const PbAuth = `${urlPaginasPublico}/auth`;
export const PbLogin = `${PbAuth}/login`;
export const PbRegister = `${PbAuth}/register`;
export const PbRegisterConfirm = `${PbRegister}/confirm`;
export const PbRestartPassword = `${PbAuth}/recuperarCuenta`;
export const PbShop = `${urlPaginasPublico}/shop`;
export const PbShopOfertas = `${PbShop}/ofertas`;
export const PbShopGratis = `${PbShop}/gratis`;
export const PTools = `${urlPaginasPublico}/tools`;
