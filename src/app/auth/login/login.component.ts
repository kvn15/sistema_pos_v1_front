import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { routerPermiso } from 'src/app/config/routerPermisos';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formUsuario = new FormControl();
  formPassword = new FormControl();
  textoValida:string = "Iniciar Sesión"

  constructor(
    private _services: LoginService,
    private _router: Router
  ) {
    // Si ya se encuentra logueado, retornarlo al home
    if (this._services.user && this._services.token) {
      this._router.navigate(["/"]);
    }
  }

  ngOnInit(): void {
    // Colocar validaciones
    this.formUsuario.setValidators([Validators.required]);
    this.formPassword.setValidators([Validators.required]);
  }


  // Metodo para loguearse
  loginUserSistema() {

    if (this.formUsuario.invalid || this.formPassword.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Debe completar todos los datos requeridos.'
      })
      return
    }

    this.textoValida = 'Validando Datos...'

    this._services.loginUsuario(this.formUsuario.value, this.formPassword.value).subscribe(
      (res: any) => {
        if (res.token_acceso) {
          setTimeout(() => {
            this._services.permissionMenu();
          }, 1000);
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: res.message
            }).then(res => {
              if (res.isConfirmed || res.dismiss || res.isDenied) {
                const permission = JSON.parse(localStorage.getItem('role_permission')!).permission
                const router: string = routerPermiso(permission) ?? '';
                console.log(router,routerPermiso(permission),permission);
                this._router.navigate([router]);
              }
            });
          }, 1700);
        } else {
          this.textoValida = 'Iniciar Sesión'
          Swal.fire({
            icon: 'warning',
            title: res
          })
        }
      }
    )

  }

}
