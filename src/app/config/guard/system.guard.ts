import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { menu } from '../menu';
import Swal from 'sweetalert2';
import { routerPermiso } from '../routerPermisos';

@Injectable({
  providedIn: 'root'
})
export class SystemGuard implements CanActivate {

  permission: string[] = [];

  constructor(
    private _router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('role_permission')) {
        this.permission = JSON.parse(localStorage.getItem('role_permission')!).permission
      }
      const title = route.routeConfig?.title;
      const menu_find = menu.find(m=> m.name === title)?.roles?.find( r => this.permission.includes(r) )
      const router: string = routerPermiso(this.permission) ?? '';
      if (!menu_find) {
        this._router.navigate([router]);
        Swal.fire({
          icon: 'warning',
          title: 'No cuentas con acceso a este modulo'
        })
        return false;
      }
      return true;
  }

}
