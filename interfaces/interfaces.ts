export interface Roles {
  id: string;
  nombre: string;
  _count: _count;
  usuarios: Usuarios[];
}

export interface Usuarios {
  id: string;
  Auth2Id: string;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string | null;
  direccion: string | null;
  fecha_nacimiento: Date | null;
  urlPerfil: string | null;
  contrasena: string;
  rol_id: string;
  roles: Roles;
  suscripcion?: suscripcion;
}

export interface backendTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface Categorias {
  id: string;
  nombre: string;
  _count: _count;
  productos: Productos[];
}

export interface _count {
  productos: string;
  usuarios: string;
  productos_ofertas: string;
}

export interface Productos {
  id: string;
  id_categoria: number;
  oferta: boolean;
  compra: boolean;
  like: boolean;
  _count: {
    likes: number;
    ventas: number;
  };
  likeCount: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_actual: {
    precio: number;
    descuento: number;
  };
  fecha_registro: Date;
  requisitos_tecnicos: string;
  categorias: Categorias;
  plan: planSuscripcion;

  versiones: Versiones[]; // Cambiar a array
  registro_productos: registro_productos[]; // Cambiar a array
  productos_ofertas: productos_ofertas[];
}

export type ProductoConRequisitosArray = Omit<Productos, "requisitos_tecnicos"> & {
  requisitos_tecnicos: string[];
};

export interface registro_productos {
  id: string;
  usuario_id: string;
  producto_id: string;
  usuario: string;
  categoria: string;
  producto: string;
  fecha_registro: Date;
  usuarios: Usuarios;
  productos: Productos;
}

export interface Versiones {
  id: string;
  producto_id: string;
  numero_version: string;
  urlarchivo: string;
  fecha_lanzamiento: Date;
  descripcion_cambios?: string;
  size?: string;
  productos: Productos;
}

export interface Estados {
  id: string;
  nombre: string;
}

export interface estados_productos {
  id: string;
  producto_id: string;
  estado_id: string;
  fecha_inicio: Date;
  fecha_fin: Date | null;
  productos: Productos;
  estados: Estados;
}

export interface ofertas {
  id: string;
  nombre: string;
  descripcion: string;
  descuento: number;
  fecha_inicio: Date;
  fecha_fin: Date;
  productos_ofertasproductos_ofertas: productos_ofertas[];
  _count: _count;
}

export interface productos_ofertas {
  compra: boolean;
  like: boolean;
  likeCount: number;
  id: string;
  promocion_id: string;
  producto_id: string;
  ofertas: ofertas;
  productos: Productos;
}

export interface Notificaciones {
  id: string;
  usuario_id: string;
  title: string;
  mensaje: string;
  html?: string;
  tipo: string;
  fecha_envio: Date;
  leido: boolean;
  usuarios?: Usuarios;
}

export interface Ventas {
  id: string;
  usuario_id: string | null;
  producto_id: string | null;
  nombre_usuario: string;
  nombre_producto: string;
  precio_original: number;
  descuento: number;
  monto_pagado: number;
  impuesto: number;
  ganancia: number;
  currency_code: string;
  fecha_registro: Date;
  productos: Productos;
}

export interface planSuscripcion {
  id: string;
  nombre: string;
  costo: number;
  beneficios: string;
  _count: {
    suscripciones: number;
    productos: number;
  };
  suscripciones: suscripcion[];
  productos: Productos[];
  gananciasMensuales: number;
}

export interface suscripcion {
  id: string;
  usuario_id: string;
  plan_id: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  plan: planSuscripcion;
  usuarios: Usuarios;
}


// compras
export interface IPagosBody {
  service: "paypal" | "mercadopago";
  compra: "producto" | "suscripcion";
  monto: number;
  currency: string;
  //datos del producto o suscripción
  productId: string; // ID del producto o plan de suscripción
  userId: string; // ID del usuario que realiza la compra
}