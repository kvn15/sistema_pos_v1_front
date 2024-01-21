import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DocumentoIdentidad } from '../interfaces/documento-identidad.interface';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { RetornoData } from '../../../Administracion/usuario/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentoIdentidadService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Metodo para listar DOCUMENTOS Identidad
  getListarDocIdentidad(): Observable<DocumentoIdentidad[]> {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento-identidad/lista';
    return this._http.get<DocumentoIdentidad[]>(url, {headers});
  }

  // Crear Tipo de Documento
  postCrearTipoDocumento(data: any) : Observable<RetornoData<DocumentoIdentidad>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento-identidad/store';
    return this._http.post<RetornoData<DocumentoIdentidad>>(url,data, {headers});
  }

  // Actualizar Tipo de Documento
  putEditarTipoDocumento(data: any, id: number) : Observable<RetornoData<DocumentoIdentidad>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento-identidad/update/'+id;
    return this._http.put<RetornoData<DocumentoIdentidad>>(url,data, {headers});
  }

  // Eliminar Tipo de Documento
  deleteTipoDocumento(id: number) : Observable<RetornoData<DocumentoIdentidad>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/documento-identidad/delete/'+id;
    return this._http.delete<RetornoData<DocumentoIdentidad>>(url, {headers});
  }
}
