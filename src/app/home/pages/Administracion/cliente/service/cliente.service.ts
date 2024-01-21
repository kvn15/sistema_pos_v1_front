import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { Cliente } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Metodo para listar cliente
  getListarCliente(): Observable<Cliente[]> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/cliente/lista';
    return this._http.get<Cliente[]>(url, {headers});
  }

  // Metodo crear
  postCrearCliente(data: any): Observable<Cliente> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/cliente/store';
    return this._http.post<Cliente>(url, data, {headers});
  }

  // Metodo Actualizar
  putEditarCliente(data: any, id: number): Observable<Cliente> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/cliente/update/'+id;
    return this._http.put<Cliente>(url,data, {headers});
  }

  // Metodo Actualizar
  deleteEliminarCliente(id: number): Observable<any> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/cliente/delete/'+id;
    return this._http.delete<any>(url,{headers});
  }
}
