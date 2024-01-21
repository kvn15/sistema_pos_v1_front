import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { API_URL_BACK } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _url: string = API_URL_BACK;
  public user: any = '';
  public token: string = '';


  constructor(
    private _http: HttpClient,
    private _router: Router
  ) {
    this.verificarTokenUser();
  }

  //
  verificarTokenUser() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token')!;
      this.user = localStorage.getItem('user')!;
    } else {
      this.token = '';
      this.user = null;
    }
  }

  // Metodo de Login
  loginUsuario(usuario: string, password: string) {

    const url = this._url+'login';

    let data = {
      user: usuario,
      password
    }

    return this._http.post(url,data).pipe(
      map((res:any) => {
        if (res.token_acceso) {
          return this.saveLocalStorageResponse(res);
        } else {
          return res.message;
        }
      }),
      catchError((err: any) => {
        return of(err);
      })
    )
  }

  //Guardar datos del usuario en local storage y variables
  saveLocalStorageResponse(res: any) {
    if (res.token_acceso && res.user) {
      // Almacenar localStorage
      localStorage.setItem("token", res.token_acceso);
      localStorage.setItem("user", JSON.stringify(res.user));
      return res;
    }
    return null;
  }

  logout() {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + this.token});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const url = this._url+'logout';
    this._http.get(url, {headers}).subscribe((resp: any) => {
      if (resp.message !== 'Unauthenticated') {
        this.user = null;
        this.token = "";
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role_permission");
        this._router.navigate(["auth/login"]);
      }
    })
  }

  removeLogout() {
    this.user = null;
    this.token = "";
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role_permission");
    this._router.navigate(["auth/login"]);
  }

  // Permisos Usuario
  permissionMenu() {
    // let headers = new HttpHeaders({'Authorization':'Bearer' + localStorage.getItem('token')});
    let headers = new HttpHeaders({'Content-type' : 'application/json'})
    const role = JSON.parse(localStorage.getItem("user")!)
    const url = this._url+'general/menuPermission/' + role.role_id;
    this._http.get(url, {headers}).subscribe((resp: any) => {
      localStorage.setItem('role_permission', JSON.stringify(resp))
    })
  }

}
