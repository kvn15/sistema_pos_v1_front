import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';
import { Categoria } from '../../interfaces/categoria.interface';
import { RetornoData } from '../../../Administracion/usuario/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  // Listar Categoria
  getListarCategorias(): Observable<Categoria[]> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/categorie/lista';
    return this._http.get<Categoria[]>(url, {headers});
  }

  // Crear Categoria
  postCreatCategoria(data: any) : Observable<RetornoData<Categoria>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/categorie/store';
    return this._http.post<RetornoData<Categoria>>(url,data, {headers});
  }

  // Editar Categoria
  putEditarCategoria(data: any, id: number) : Observable<RetornoData<Categoria>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/categorie/update/'+id;
    return this._http.put<RetornoData<Categoria>>(url,data, {headers});
  }

  // Editar Estado
  postEstadoCategoria(data: any, id: number) : Observable<RetornoData<any>> {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'almacen/categorie/changeEstado/'+id;
    return this._http.post<RetornoData<any>>(url,data, {headers});
  }

}
