export interface Producto {
  id: number;
  codigo_barras: string;
  nombre_producto: string;
  categoria: string;
  stock_inicial: number;
  stock_limite: number;
  proveedor: string;
  fecha_vencimiento: string;
  price_compra: number;
  imagen_producto: string;
  price_venta: number;
  laboratorio: string;
  laboratorio_otro: string;
  marca: string;
  marca_otro: string;
  state: number;
  state_name: string;
}

export interface RetornoListaProducto {
  data : Producto[]
}

//
export interface DataComboxProducto {
  tipo_producto?: GeneralProducto[];
  categoria?:     GeneralProducto[];
  proveedor?:     Proveedor[];
  tributo_sunat?: TributoSunat[];
  unidad_medida?: UnidadMedida[];
  laboratorio?:   GeneralProducto[];
  marca?:         GeneralProducto[];
}

export interface GeneralProducto {
  id:             number;
  name?:          string;
  state:          number;
  created_at:     Date;
  updated_at:     Date;
  laboratorio?:   string;
  marca?:         string;
  tipo_producto?: string;
}

export interface Proveedor {
  id:           number;
  ruc:          string;
  razon_social: string;
  ubigeo:       string;
  sIdUbigeo:    string;
  direccion:    string;
  celular:      null;
  email:        null;
  state:        number;
  created_at:   Date;
  updated_at:   Date;
}

export interface TributoSunat {
  id:                number;
  cod_tributo:       string;
  tributo:           string;
  cod_internacional: string;
  nombre:            string;
  valor_tri:         number;
  state:             number;
  created_at:        Date;
  updated_at:        Date;
}

export interface UnidadMedida {
  id:           number;
  name:         string;
  abreviatura:  string;
  equivalencia: null | string;
  state:        number;
  created_at:   Date;
  updated_at:   Date;
}


///
export interface ProductoId {
  id:                 number;
  tipo_producto_id:   number;
  categoria_id:       number;
  codigo_barras:      string;
  nombre_producto:    string;
  detalle_producto:   string;
  principio_activo:   string;
  marca_id:           number;
  marca_otro:         string;
  provedor_id:        number;
  stock_inicial:      number;
  stock_limite:       number;
  price_compra:       number;
  imagen_producto:    string;
  fecha_vencimiento:  string;
  lote:               string;
  registro_sanitario: string;
  presentacion:       string;
  tributo_sunat_id:   number;
  laboratorio_id:     number;
  laboratorio_otro:   string;
  state:              number;
  state_name:         string;
  details_product:    DetailsProduct[];
}

export interface DetailsProduct {
  id:                    number;
  product_id:            number;
  unidad_medida_id:      number;
  cantidad_unidad:       number;
  precio_venta_cantidad: number;
  created_at:            Date;
  updated_at:            Date;
}


export interface ValidarCodigoBarra {
  exist_producto: boolean;
}
