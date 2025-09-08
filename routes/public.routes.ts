export const urlBackend_Public =
  process.env.EXPO_PUBLIC_URL_BACKEND ||
  process.env.NEXT_PUBLIC_URL_BACKEND ||
  'http://localhost:3001';

//rutas de registro y autenticacionurlBackend_Public
export const AuthB_Public = `${urlBackend_Public}/auth`; //get
export const RegistroB_Public = `${AuthB_Public}/register`; //post
export const ConfirmedB_Public = `${RegistroB_Public}/confirm`; //post
export const LoginB_Public = `${AuthB_Public}/login`; //post
export const RefreshB_Public = `${AuthB_Public}/refresh`; //post
export const Auth2B_Public = `${AuthB_Public}/auth2`; //get

//rutas de autenticacion mediante github
export const LoginGithubB_Public = `${urlBackend_Public}/github`; //get
export const LoginGithubCallbackB_Public = `${urlBackend_Public}/github/callback`; //get

//rutas de autenticacion mediante github
export const LoginDiscordbB_Public = `${urlBackend_Public}/discord`; //get
export const LoginDiscorsCallbackB_Public = `${urlBackend_Public}/discord/callback`; //get

//ruta de verficacion de sesion activa
export const SesionB_Public = `${AuthB_Public}/sesion`; //get

export const TiendaB_Public = `${urlBackend_Public}/tienda`;

export const PlanSuscripcionB_Public = `${urlBackend_Public}/planes`;

//rutas de la tienda
export const ProductosDePagaB_Public = `${TiendaB_Public}/tienda`; //get
