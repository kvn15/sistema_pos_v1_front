import { Injectable } from '@angular/core';
import { API_URL_BACK } from '../config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Permission, ProductoVenta, Roles, TipoDocumento } from './general.interface';
import { DataComboxProducto } from 'src/app/home/pages/almacen/interfaces/producto.interface';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Metodo para listar permisos
  getListarPermisos(): Observable<Permission[]> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'general/listaPermission';
    return this._http.get<Permission[]>(url, {headers});
  }


  // Metodo para listar roles
  getListarRoles(): Observable<Roles[]> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'general/listaRole';
    return this._http.get<Roles[]>(url, {headers});
  }

  // Lista Combox
  getListaCombox(): Observable<DataComboxProducto[]> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'general/listaGeneralProducto';
    return this._http.get<DataComboxProducto[]>(url, {headers});
  }

  // Lista Tipo de Documento
  getListaTipoDocumento(): Observable<TipoDocumento[]> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'general/obtenerTipoDocumento';
    return this._http.get<TipoDocumento[]>(url, {headers});
  }

  // Obtener Productos
  getListaProductosVenta() {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'general/productosVenta';
    return this._http.get<ProductoVenta[]>(url, {headers});
  }

  // Obtener Impuestos
  getListaImpuestos() {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'general/productosVenta';
    return this._http.get<ProductoVenta[]>(url, {headers});
  }

}
