import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/auth/services/login.service';
import { API_URL_BACK_GENERAL } from 'src/app/config/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  nombre: string = '';
  rol: string = '';
  file_foto: string= '';

  URL_BACKEND:any = API_URL_BACK_GENERAL+'storage/';

  constructor(
    private _service: LoginService
  ) { }

  ngOnInit(): void {
    this.nombre = JSON.parse(this._service.user).name
    this.rol = JSON.parse(this._service.user).role_name
    this.file_foto = JSON.parse(this._service.user).file_foto == '' ? 'assets/img/avatars/2.png' : this.URL_BACKEND + JSON.parse(this._service.user).file_foto;
  }

  // Metodo para Cerrar Sesión
  cerrarSesion() {
    this._service.logout();
  }

}
