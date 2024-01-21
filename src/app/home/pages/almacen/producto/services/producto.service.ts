import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { Producto, ProductoId, RetornoListaProducto, ValidarCodigoBarra } from '../../interfaces/producto.interface';
import { RetornoData, RetornoDataV2 } from 'src/app/config/service/general.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Listar Productos
  getListarProductos(): Observable<RetornoListaProducto> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/products/lista';
    return this._http.get<RetornoListaProducto>(url, {headers});
  }

  // Registrar Producto
  postRegistrarProducto(data: any): Observable<RetornoData> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/products/store';
    return this._http.post<RetornoData>(url, data, {headers});
  }

  // Editar Producto
  putEditarProducto(data: any, id: number): Observable<RetornoData> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/products/update/'+id;
    return this._http.put<RetornoData>(url, data, {headers});
  }

  // Subir foto Producto
  postSubirFotoProducto(data: any): Observable<RetornoData> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/products/subirNuevaImagenStore';
    return this._http.post<RetornoData>(url, data, {headers});
  }

  // Obtener Producto
  getObtenerProducto(id: number) {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/products/obtenerProducto/'+id;
    return this._http.get<ProductoId>(url, {headers});
  }

  // Editar Estado
  postEstadoProducto(data: any, id: number) : Observable<RetornoDataV2<any>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/products/changeEstado/'+id;
    return this._http.post<RetornoDataV2<any>>(url,data, {headers});
  }

  // Validar Codigo de Barra
  postValidarCodigoBarra(data: any) {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/products/validarCodigoBarra';
    return this._http.post<any>(url, data, {headers});
  }

}
