import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private _service: LoginService,
    private _router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (!this._service.user && !this._service.token) {
        if (localStorage.getItem('user') && localStorage.getItem('token')) {
          this._service.token = localStorage.getItem('token')!;
          this._service.user = localStorage.getItem('user')!;
          // No tiene Acceso
          return true;
        } else {
          this._router.navigate(["auth/login"]);
          // No tiene Acceso
          return false;
        }
      }

    let token = this._service.token;
    // Obtenemos el tiempo de expiración del token generado
    let expiracion = (JSON.parse(atob(token.split('.')[1]))).exp;
    if (Math.floor((new Date().getTime() / 1000)) >= expiracion) {
      //Utilizar el metodo logout para limpiar las variables
      this._service.removeLogout();
      return false;
    }
    return true
  }

  canLoad(): Observable<boolean> | boolean {
    return true
  }

}
