import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { RetornoData } from '../../../Administracion/usuario/interfaces/usuario.interface';
import { UnidadMedida } from '../../interfaces/unidad-medida.interface';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Listar UnidadMedida
  getListarUnidadMedida(): Observable<UnidadMedida[]> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/unidad_medida/lista';
    return this._http.get<UnidadMedida[]>(url, {headers});
  }

  // Crear Categoria
  postCreatUnidadMedida(data: any) : Observable<RetornoData<UnidadMedida>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/unidad_medida/store';
    return this._http.post<RetornoData<UnidadMedida>>(url,data, {headers});
  }

  // Editar UnidadMedida
  putEditarUnidadMedida(data: any, id: number) : Observable<RetornoData<UnidadMedida>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/unidad_medida/update/'+id;
    return this._http.put<RetornoData<UnidadMedida>>(url,data, {headers});
  }

  // Editar Estado
  postEstadoUnidadMedida(data: any, id: number) : Observable<RetornoData<any>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/unidad_medida/changeEstado/'+id;
    return this._http.post<RetornoData<any>>(url,data, {headers});
  }

  // Eliminar Unidad de Medida
  deleteUnidaMedida(id: number) : Observable<RetornoData<any>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/unidad_medida/delete/'+id;
    return this._http.delete<RetornoData<any>>(url, {headers});
  }

}
