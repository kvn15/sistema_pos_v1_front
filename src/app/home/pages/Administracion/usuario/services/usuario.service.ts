import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { RetornoData, Usuarios } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Metodo para listar usuario
  getListarUsuarios(): Observable<Usuarios[]> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/user_list';
    return this._http.get<Usuarios[]>(url, {headers});
  }

  postCreatUsuario(data: any) : Observable<RetornoData<Usuarios>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/user/store';
    return this._http.post<RetornoData<Usuarios>>(url,data, {headers});
  }

  postEditUsuario(data: any) : Observable<RetornoData<Usuarios>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/user/update';
    return this._http.post<RetornoData<Usuarios>>(url,data, {headers});
  }

  postChangeEstado(data: any) : Observable<RetornoData<any>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'administracion/user/changeEstado';
    return this._http.post<RetornoData<any>>(url,data, {headers});
  }
}
