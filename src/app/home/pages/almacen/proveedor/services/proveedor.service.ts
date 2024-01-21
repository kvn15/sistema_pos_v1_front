import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { RetornoData } from '../../../Administracion/usuario/interfaces/usuario.interface';
import { Proveedor } from '../../interfaces/Proveedor.interface';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Listar Proveedor
  getListarProveedor(): Observable<Proveedor[]> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/proveedor/lista';
    return this._http.get<Proveedor[]>(url, {headers});
  }

  // Crear Proveedor
  postCreatProveedor(data: any) : Observable<RetornoData<Proveedor>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/proveedor/store';
    return this._http.post<RetornoData<Proveedor>>(url,data, {headers});
  }

  // Editar Proveedor
  putEditarProveedor(data: any, id: number) : Observable<RetornoData<Proveedor>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/proveedor/update/'+id;
    return this._http.put<RetornoData<Proveedor>>(url,data, {headers});
  }

  // Editar Estado
  postEstadoProveedor(data: any, id: number) : Observable<RetornoData<any>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/proveedor/changeEstado/'+id;
    return this._http.post<RetornoData<any>>(url,data, {headers});
  }
}
