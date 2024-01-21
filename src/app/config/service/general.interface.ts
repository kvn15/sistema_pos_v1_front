export interface Permission {
  id: number;
  cod_permission: string;
  name_permission: string;
}

export interface Roles {
  id: number;
  rol_name: string;
  permisos_defecto: string;
}


export interface RetornoData {
  success: boolean;
  message: string;
  data?: any
}


export interface RetornoDataV2<T> {
  message: string;
  data: T;
}

export interface TipoDocumento {
  id: number;
  cod_tipo_doc: string;
  tipo_doc: string;
  abrev_tipo_doc: string;
  long_tipo_doc: number;
}


export interface ProductoVenta {
  id: number;
  codigo_barras: string;
  nombre_producto: string;
  categoria_id : number;
  name_categoria: string;
  stock_final	: number;
  unidadMedida: DetailUnidadMedida[]
}

export interface DetailUnidadMedida {
  unidad_medida_id: number;
  unidad_medida: string;
  cantidad_unidad: number;
  precio_venta_cantidad: number;
}
