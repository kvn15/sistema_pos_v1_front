import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL_BACK } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ConsultaSunatService {

  private _url: string = API_URL_BACK;

  constructor(
    private _http: HttpClient
  ) { }

  fnConsultarRucSunat(ruc: string) {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/consultaRuc/'+ruc.trim();
    return this._http.get<any>(url, {headers});
  }

  fnConsultaDniSunat(dni: string) {
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'sunat/consultaDni/'+dni.trim();
    return this._http.get<any>(url, {headers});
  }

}
