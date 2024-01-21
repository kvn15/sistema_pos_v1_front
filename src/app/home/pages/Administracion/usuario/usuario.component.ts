import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from './interfaces/usuario.interface';
import { UsuarioService } from './services/usuario.service';
import { Subject, finalize } from 'rxjs';
import { LanguageApp } from 'src/app/config/languajeDataTable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroUsuarioComponent } from './components/registro-usuario/registro-usuario.component';
import { API_URL_BACK_GENERAL } from 'src/app/config/config';
import { DataTableDirective } from 'angular-datatables';
import Swal from 'sweetalert2';
import { EditarUsuarioComponent } from './components/editar-usuario/editar-usuario.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from 'src/app/auth/services/login.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false}) dtElement!: DataTableDirective;

  lUsuarios: Usuarios[] = [];
  loading: boolean = false;

  URL_BACKEND:any = API_URL_BACK_GENERAL+'storage/';

  //#region Tabla

  dataSource!: MatTableDataSource<Usuarios>;
  displayedColumns: string[] = ['opcion', 'user', 'name', 'email', 'role_name', 'file_foto', 'state_name'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _loginService: LoginService,
    private _service: UsuarioService,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fnListarUsuario();
  }

  // Metodo para obtener los usuarios
  fnListarUsuario() {
    this.loading = true;
    this._service.getListarUsuarios().pipe(finalize(() => this.loading = false)).subscribe( (data: Usuarios[]) => {
      this.lUsuarios = data;
      this.dataSource = new MatTableDataSource(this.lUsuarios);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Abrir Modal Nuevo Usuario
  fnOpenCrearUsuario() {
    const modalRef = this.modelService.open(RegistroUsuarioComponent, {centered: true, size: 'xl', backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalUserAdd.subscribe( (resp:any) => {
      if (resp) {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Abrir Modal Editar Usuario
  async fnOperEditarUsuario(usuario: Usuarios) {
    const usuarioId = JSON.parse(localStorage.getItem('user')!).id;

    if (usuarioId === usuario.id) {
      const swal = await Swal.fire({
        icon: 'info',
        title: 'Entrara a la edición de su Usuario, si realiza cambios se cerrara la sesión.',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar'
      })

      if (!swal.isConfirmed) {
        return;
      }
    }

    const modalRef = this.modelService.open(EditarUsuarioComponent, {centered: true, size: 'xl', backdrop: 'static'});
    modalRef.componentInstance.user_edit = usuario;
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalUserEdit.subscribe( (resp:Usuarios) => {
      if (resp) {
        if (usuarioId === resp.id) {
          if (JSON.stringify(usuario) !== JSON.stringify(resp)) {
            this._loginService.logout();
            return;
          }
        }
        let index = this.dataSource.data.findIndex(d => d.id === resp.id);
        this.dataSource.data[index] = resp;
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Dar de baja al usuario
  fnDarBajaORAltaUser(id: number, usuario: string, baja: boolean) {

    let title = `¿Seguro de dar de ${!baja ? 'Baja' : 'Alta'} a ${usuario.trim()}`

    let Estado = baja ? 1 : 2;

    Swal.fire({
      icon: 'question',
      title: title,
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then( (swal) => {
      if (swal.isConfirmed) {
        const data = {
          id: id,
          state: Estado
        }
        this._service.postChangeEstado(data).subscribe( ({message}) => {
          if (message === 'true') {
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado correctamente'
            })
            this.dataSource.data.find(u => u.id === id)!.state = Estado;
            if (baja) {
              this.dataSource.data.find(u => u.id === id)!.state_name = 'Activo';
            } else {
              this.dataSource.data.find(u => u.id === id)!.state_name = 'Desactivado';
            }
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })
  }


}
