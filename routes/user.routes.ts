export const urlApiGetWay =
  process.env.EXPO_PUBLIC_URL_API || process.env.NEXT_PUBLIC_URL_API || 'http://localhost:3002';
export const urlBackend_Client =
  process.env.EXPO_PUBLIC_URL_BACKEND ||
  process.env.NEXT_PUBLIC_URL_BACKEND ||
  'http://localhost:3001';
//export const urlBackend_Client = `${urlApiGetWay}/backend`;
export const urlNotificaciones_Client = `${urlBackend_Client}`;
export const urlBot_Client =
  process.env.EXPO_PUBLIC_URL_BOT || process.env.NEXT_PUBLIC_URL_BOT || 'http://localhost:3003';
//export const urlBot_Client = `${urlApiGetWay}/bot`;

//rutas de registro y autenticacion
export const AuthB_Public = `${urlBackend_Client}/auth`; //get
export const LoginB_Client = `${AuthB_Public}/login`; //post
export const RegistroB_Client = `${AuthB_Public}/register`; //post
export const RegistroConfirmarB_Client = `${RegistroB_Client}/confirm`; //post

export const RestablecerContraseniaB_Client = `${AuthB_Public}/acount/restart`; //post
export const ActualizarContraseniaB_Client = `${AuthB_Public}/acount/updatePasword`; //post

//rutas de autenticacion mediante github
export const LoginGithubB_Client = `${urlBackend_Client}/github`; //get
export const LoginGithubCallbackB_Client = `${urlBackend_Client}/github/callback`; //get

//rutas de verficacion de sesion activa
export const SesionB_Client = `${AuthB_Public}/sesion`; //get
export const SesionResfreshB_Client = `${AuthB_Public}/refresh`; //get

//ruta de cierre de sesion
export const LogoutB_Client = `${AuthB_Public}/logout`; //post

//rutas para comprar con paypal
export const ComprarPaypal_Client = `${urlBackend_Client}/paypal/crearPago`; //post
export const ExecutePagoPaypal_Client = `${urlBackend_Client}/paypal/ejecutarPago`; //get

//rutas para comprar con mercadoPago
export const ComprarMercadoPago_Client = `${urlBackend_Client}/mercadoPago/crearPago`; //post
export const ExecutePagoMercadoPago_Client = `${urlBackend_Client}/mercadoPago/ejecutarPago`; //get

//ruta de envio de correos
export const NotificarCorreo_Client = `${urlBackend_Client}/mail`; //post

export const LikesB_Client = `${urlBackend_Client}/likes`;
export const NotificacionesB_Client = `${urlBackend_Client}/notificaciones`;
export const OfertasB_Client = `${urlBackend_Client}/ofertas`;
export const PersonaB_Client = `${urlBackend_Client}/persona`;
export const ProductosB_Client = `${urlBackend_Client}/productos`;
export const TiendaB_Client = `${urlBackend_Client}/tienda`;
export const UsuariosB_Client = `${urlBackend_Client}/usuarios`;
export const PerfilB_Client = `${UsuariosB_Client}/perfil`;
export const VersionesB_Client = `${urlBackend_Client}/versiones`;
export const PlanesB_Client = `${urlBackend_Client}/planes`;

//rutas de compras
export const ComprarProductoB_Client = `${ProductosB_Client}/comprar?service=`; //post paypal or mercadopago
export const PagarProductoB_Client = `${ProductosB_Client}/pagar`; //get
export const ComprarPlanB_Client = `${PlanesB_Client}/comprar?service=`; //post
export const PagarPlanB_Client = `${PlanesB_Client}/pagar`; //get

// rutas nuevas de compras
export const ComprarB_ClientNew = `${urlBackend_Client}/pagos`; //post
export const PagarB_ClientNew = `${urlBackend_Client}/pagos/detalle`; //post

//rutas de la tienda
export const ProductosEnOfertasB_Client = `${TiendaB_Client}/ofertas`; //get
export const ProductosFavoritossB_Client = `${TiendaB_Client}/favoritos`; //get

export const NotificacionesHistorialB_Client = `${NotificacionesB_Client}/historial`; //get
export const TiendaHistorialUserCompradosB_Client = `${TiendaB_Client}/historial`; //get
export const DetailsCompraB_Client = `${TiendaHistorialUserCompradosB_Client}/compra`; //get
