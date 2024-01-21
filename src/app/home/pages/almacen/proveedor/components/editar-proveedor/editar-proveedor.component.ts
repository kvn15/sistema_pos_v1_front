import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ubigeo, ubigeo } from 'src/app/config/helpers/ubigeo';
import { ConsultaSunatService } from 'src/app/resource/services/consulta-sunat.service';
import Swal from 'sweetalert2';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../../interfaces/Proveedor.interface';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.css']
})
export class EditarProveedorComponent implements OnInit {

  @Output() modalProveedorEdit: EventEmitter<any> = new EventEmitter<any>();
  @Input() proveedor_edit!: Proveedor;

  frmProveedor!: FormGroup;

  // Ubigeos
  lDepartamento: Ubigeo[] = [];
  lProvincia: Ubigeo[] = [];
  lDistrito: Ubigeo[] = [];

  constructor(
    public modal: NgbActiveModal,
    private _service: ProveedorService,
    private _sunatService: ConsultaSunatService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.frmProveedor = this._fb.group({
      ruc: ['', [Validators.required,Validators.minLength(11) ,Validators.maxLength(11)]],
      razon_social: ['', [Validators.required, Validators.maxLength(250)]],
      departamento: [''],
      provincia: [''],
      distrito: [''],
      ubigeo: [''],
      direccion: ['', [Validators.maxLength(250)]],
      celular: ['', [Validators.maxLength(12)]],
      email: ['', [Validators.email,Validators.maxLength(250)]],
    })
    this.lDepartamento = ubigeo.departamentos;
    this.fnRellenarProveedor();
  }

  //
  fnObtenerProvincia() {
    const idDepartamento = this.frmProveedor.value.departamento;
    this.lProvincia = [];
    this.lDistrito = [];
    if (idDepartamento === null || idDepartamento === '') {
      this.frmProveedor.controls['departamento'].setValue('');
      this.frmProveedor.controls['provincia'].setValue('');
      this.frmProveedor.controls['distrito'].setValue('');
      return
    }
    this.lProvincia = ubigeo.provincias[idDepartamento];
  }


  //
  fnObtenerDistrito() {
    const idProvincia = this.frmProveedor.value.provincia;
    this.lDistrito = [];
    if (idProvincia === null || idProvincia === '') {
      this.frmProveedor.controls['provincia'].setValue('');
      this.frmProveedor.controls['distrito'].setValue('');
      return
    }
    this.lDistrito = ubigeo.distritos[idProvincia];
  }

  fnConsultarRuc($event: any) {
    if ($event.keyCode === 13) {
      const Ruc: string = this.frmProveedor.controls['ruc'].value;

      if (Ruc.length !== 11) {
        this.frmProveedor.reset();
        Swal.fire({
          icon: 'warning',
          title: 'Solo se aceptan 11 caracteres.'
        })
        return;
      }

      this._sunatService.fnConsultarRucSunat(Ruc).subscribe( (data: any) => {
        if (data) {
          if (typeof data.ruc !== 'undefined') {
            const form = this.frmProveedor.controls;
            form['razon_social'].patchValue(data.razonSocial)
            form['ubigeo'].patchValue(data.ubigeo)
            form['direccion'].patchValue(data.direccion)
            // Si existe Ubigeo
            if (data.ubigeo) {
              const departamento = data.departamento.toLowerCase();
              const provincia = data.provincia.toLowerCase();
              const distrito = data.ubigeo.slice(4)

              const nIdDepartamento = (ubigeo.departamentos as Ubigeo[]).find(d => d.nombre_ubigeo.toLowerCase().trim() === departamento.trim())?.id_ubigeo!;
              const nIdProvincias = (ubigeo.provincias[nIdDepartamento] as Ubigeo[]).find(d => d.nombre_ubigeo.toLowerCase().trim() === provincia.trim())?.id_ubigeo!;
              const nIdDistritos = (ubigeo.distritos[nIdProvincias] as Ubigeo[]).find(d => d.codigo_ubigeo === distrito)?.id_ubigeo;

              form['departamento'].patchValue(nIdDepartamento)
              form['provincia'].patchValue(nIdProvincias)
              form['distrito'].patchValue(nIdDistritos)

              this.fnObtenerProvincia();
              this.fnObtenerDistrito();
            }
          } else {
            Swal.fire({
              icon: 'warning',
              title: 'No se encontro Ruc, por favor registrarlo manualmente.'
            })
            this.frmProveedor.controls['ruc'].patchValue(Ruc)
            this.frmProveedor.reset();
          }
        }
      }, err => this.frmProveedor.reset())

    }
  }

  // Rellenar datos
  fnRellenarProveedor() {
    this.frmProveedor.patchValue(this.proveedor_edit)
    if (this.proveedor_edit.sIdUbigeo && this.proveedor_edit.sIdUbigeo.length > 0) {
      const lIdUbigeos = this.proveedor_edit.sIdUbigeo.split('|');
      this.frmProveedor.controls['departamento'].patchValue(lIdUbigeos[0]);
      this.fnObtenerProvincia();
      this.frmProveedor.controls['provincia'].patchValue(lIdUbigeos[1]);
      this.fnObtenerDistrito();
      this.frmProveedor.controls['distrito'].patchValue(lIdUbigeos[2]);
    }
  }

  //
  fnGuardarProveedor() {
    if (this.frmProveedor.invalid) {
      return Object.values(this.frmProveedor.controls).forEach(control => {
          if (control instanceof FormGroup) {
              Object.values(control.controls).forEach(control => control.markAsTouched())
          } else {
              control.markAsTouched()
          }
      })
    }

    const form = this.frmProveedor.controls;

    let sUbigeo = null;
    let _ubigeo = null;
    //Obtener el Ubigeo
    // validar
    if (form['departamento'].value) {
      if (!form['provincia'].value || !form['distrito'].value) {
        Swal.fire({
          icon: 'warning',
          title: 'Debe seleccionar una Provincia y Distrito.'
        })
        return;
      }
      const cod_departamento = (ubigeo.departamentos as Ubigeo[]).find(u=>u.id_ubigeo === form['departamento'].value)?.codigo_ubigeo;
      const cod_provincia = (ubigeo.provincias[form['departamento'].value] as Ubigeo[]).find(u=>u.id_ubigeo === form['provincia'].value)?.codigo_ubigeo;
      const cod_distrito = (ubigeo.distritos[form['provincia'].value] as Ubigeo[]).find(u=>u.id_ubigeo === form['distrito'].value)?.codigo_ubigeo;
      //
      _ubigeo = `${cod_departamento}${cod_provincia}${cod_distrito}`
      sUbigeo = `${form['departamento'].value}|${form['provincia'].value}|${form['distrito'].value}`;
    }

    const data = {
      ruc: form['ruc'].value.trim(),
      razon_social: form['razon_social'].value.trim(),
      ubigeo: _ubigeo,
      sIdUbigeo: sUbigeo,
      direccion: form['direccion'].value,
      celular: form['celular'].value,
      email: form['email'].value
    }

    this._service.putEditarProveedor(data, this.proveedor_edit.id).subscribe(({message, data}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalProveedorEdit.emit(data);
      }
    })
  }

}
