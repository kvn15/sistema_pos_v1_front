import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Usuarios } from '../../interfaces/usuario.interface';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GeneralService } from 'src/app/config/service/general.service';
import { UsuarioService } from '../../services/usuario.service';
import { Permission, Roles } from 'src/app/config/service/general.interface';
import Swal from 'sweetalert2';
import { API_URL_BACK_GENERAL } from 'src/app/config/config';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit, AfterViewInit {

  @Output() modalUserEdit: EventEmitter<Usuarios> = new EventEmitter<Usuarios>();
  @Input() user_edit!: Usuarios;

  imagen_previsualiza: any = null;
  imagen_file: any = null;
  URL_BACKEND:any = API_URL_BACK_GENERAL+'storage/';

  //
  formPermisos!: FormGroup;
  //
  listaRoles: Roles[] = [];

  // FormControl
  frmNombre = new FormControl('', [Validators.required, Validators.maxLength(250)])
  frmUsuario = new FormControl('', [Validators.required, Validators.maxLength(250)])
  frmCorreo = new FormControl('', [Validators.required, Validators.maxLength(250), Validators.email])
  frmRole = new FormControl('', [Validators.required])
  frmPassword = new FormControl('')
  frmConfirmPassword = new FormControl('')

  constructor(
    public modal: NgbActiveModal,
    private _generalService: GeneralService,
    private _fb: FormBuilder,
    private _service: UsuarioService
  ) { }


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fnRellenarData();
      this.fnListarRoles();
      this.fnListarPermisos();
    });
  }

  ngOnInit(): void {
    this.formPermisos = this._fb.group({
      array_form: this._fb.array([])
    })
  }

  public get getArrayPermisos() : FormArray {
    return this.formPermisos.get("array_form") as FormArray;
  }

  // Listar Permisos
  fnListarPermisos() {
    this._generalService.getListarPermisos().subscribe( (per: Permission[]) => {
      per.forEach( p => {
        // Rellenamos los permisos del usuario
        const permisoUser = this.user_edit.permissions.split('|').includes(p.id.toString());
        this.getArrayPermisos.push(this._fb.group({
          ...p,
          bEscogio: [permisoUser]
        }))
      })
    })
  }

  // Listar Roles
  fnListarRoles() {
    this._generalService.getListarRoles().subscribe( (role: Roles[]) => {
      this.listaRoles = role
    })
  }

    // change
  fnChangeRoles(event: any) {
    this.getArrayPermisos.controls.forEach(c => {
      c.get('bEscogio')?.setValue(false);
    })
    if (event.value === '') {
      return;
    }
    const Id = Number(event.value);
    const permiso_defecto: string = this.listaRoles.find( lr => lr.id === Id)?.permisos_defecto!;
    const lPermisosDefecto = permiso_defecto.split('|');
    // Si los permisos por defecto es ALL se selecciona todas las casillas
    if (this.listaRoles.find( lr => lr.id === Id)?.permisos_defecto! === 'ALL') {
      this.getArrayPermisos.controls.forEach(c => {
        c.get('bEscogio')?.setValue(true);
      })
    } else {// se selecciona en base a los permisos por defecto
      lPermisosDefecto.forEach(lp => {
        this.getArrayPermisos.controls.find( c => c.value.cod_permission === lp )?.get('bEscogio')?.setValue(true)
      })
    }
  }

  // Previsualizar Imagen
  fnProcesarImagen($event: any) {
    const maxMB = 4000000 //4 MB
    if ($event.target.files[0].type !== 'image/png' && $event.target.files[0].type !== 'image/jpeg' && $event.target.files[0].type !== 'image/jpg') {
      Swal.fire({
        icon: 'warning',
        title: 'El archivo no es una imagen.'
      });
      return;
    }
    if ($event.target.files[0].size > maxMB) {
      Swal.fire({
        icon: 'warning',
        title: 'La imagen supera el tamaño maximo de MB(4 MB Max.)'
      });
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader(); //Nos permite leer el archivo
    reader.readAsDataURL(this.imagen_file); //lees este archivo
    reader.onload = () => this.imagen_previsualiza = reader.result; //guardame la imagen en base 64
  }

  // Rellenar Data
  fnRellenarData() {
    console.log(this.user_edit)
    this.frmNombre.setValue(this.user_edit.name);
    this.frmUsuario.setValue(this.user_edit.user);
    this.frmCorreo.setValue(this.user_edit.email);
    this.frmRole.setValue(this.user_edit.role_id.toString());
    this.imagen_previsualiza = this.user_edit.file_foto !== '' ? this.URL_BACKEND + this.user_edit.file_foto : 'assets/img/avatars/2.png';
  }

  // Guardar datos Usuario
  fnGuardarUsuario() {
    const frmNombre = this.frmNombre;
    const frmUsuario = this.frmUsuario;
    const frmCorreo = this.frmCorreo;
    const frmRole = this.frmRole;
    const frmPassword = this.frmPassword;
    const frmConfirmPassword = this.frmConfirmPassword;

    if (frmNombre.hasError('required') || frmUsuario.hasError('required') || frmCorreo.hasError('required') || frmRole.hasError('required')) {
      Swal.fire({
        icon: 'warning',
        title: 'Hay campos vacíos, por favor completarlos.'
      });
      return;
    }

    if (frmNombre.hasError('maxlength') || frmUsuario.hasError('maxlength') || frmCorreo.hasError('maxlength')) {
      Swal.fire({
        icon: 'warning',
        title: 'Se Supero el maximo de caractes para el Nombre, Usuario o Correo (Max 250)'
      });
      return;
    }

    if (frmCorreo.hasError('email')) {
      Swal.fire({
        icon: 'warning',
        title: 'El Campo correo debe ser un correo valído.'
      });
      return;
    }

    if (frmPassword.value) {
      if (frmPassword.value !== frmConfirmPassword.value) {
        Swal.fire({
          icon: 'warning',
          title: 'Las contraseñas ingresadas son distintas.'
        });
        return;
      }
    }

    if (this.getArrayPermisos.value.filter( (p: any) => p.bEscogio === true ).length < 2) {
      Swal.fire({
        icon: 'warning',
        title: 'El usuario debe tener como mínimo 2 permisos asignados.'
      });
      return;
    }

    const permission = this.getArrayPermisos.value.map( (p: any) => {
      if (p.bEscogio === true) {
        return p.id
      } else {
        return null;
      }
    })

    // Obtengo los permisos seleccionados
    const permisos = permission.filter( (p: any) => p !== null).join('|');

    // Creamos el Form Data
    let formData = new FormData();
    formData.append("id", this.user_edit.id.toString())
    formData.append("name", frmNombre.value!.trim())
    formData.append("user", frmUsuario.value!.trim())
    formData.append("email", frmCorreo.value!.trim())
    formData.append("role_id", frmRole.value!)
    formData.append("password", frmPassword.value! ?? '')
    formData.append("file_foto", this.imagen_file);
    formData.append("permission", permisos);

    this._service.postEditUsuario(formData).subscribe( ({message, data}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalUserEdit.emit(data);
      }
    });

  }

}
