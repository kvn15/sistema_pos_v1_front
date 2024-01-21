export interface CargaProducto {
  codigo_barras: string;
  tipo_producto: string;
  categoria: string;
  nombre_producto: string;
  detalle_producto: string;
  proveedor_ruc: string;
  stock_inicial: number;
  stock_limite: number;
  price_compra: number;
  tributo: string;
  presentacion: string;
  registro_sanitario: string;
  lote: string;
  fecha_vencimiento: string;
  marca: string;
  laboratorio: string;
  principio_activo: string;
  detalle_unidad: string;
  bCodigoBarra: boolean;
}
