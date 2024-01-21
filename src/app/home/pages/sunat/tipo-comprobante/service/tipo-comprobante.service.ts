import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { RetornoData } from '../../../Administracion/usuario/interfaces/usuario.interface';
import { TipoComprobante } from '../interfaces/tipo-comprobante.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoComprobanteService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Metodo para listar comprobantes
  getListarTipoComprobante(): Observable<TipoComprobante[]> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento/lista';
    return this._http.get<TipoComprobante[]>(url, {headers});
  }

  postCrearTipoComprobante(data: any) : Observable<RetornoData<TipoComprobante>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento/store';
    return this._http.post<RetornoData<TipoComprobante>>(url,data, {headers});
  }

  putEditTipoComprobante(data: any, id: number) : Observable<RetornoData<TipoComprobante>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento/update/'+id;
    return this._http.put<RetornoData<TipoComprobante>>(url,data, {headers});
  }

  postChangeEstado(data: any) : Observable<RetornoData<any>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento/changeEstado';
    return this._http.post<RetornoData<any>>(url,data, {headers});
  }

}
