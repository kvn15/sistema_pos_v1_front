import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TipoDocumento } from 'src/app/config/service/general.interface';
import { GeneralService } from 'src/app/config/service/general.service';
import { ConsultaSunatService } from 'src/app/resource/services/consulta-sunat.service';
import Swal from 'sweetalert2';
import { ClienteService } from '../../service/cliente.service';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit, AfterViewInit {

  @Output() modalClienteAdd: EventEmitter<any> = new EventEmitter<any>();

  // Listas
  lTipoDocumento: TipoDocumento[] = [];

  // Formulario
  formCliente!: FormGroup;

  // Mas Datos
  nro_longitud: number = 0;

  constructor(
    public modal: NgbActiveModal,
    private _fb: FormBuilder,
    private _service2: GeneralService,
    private _serviceConsulta: ConsultaSunatService,
    private _service: ClienteService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      //
      this.fnTiposDocumento();
    });
  }

  ngOnInit(): void {
    this.formCliente = this._fb.group({
      tipo_documento_id: [null, [Validators.required]],
      nro_documento: [null, [Validators.required]],
      nombres: [null],
      apellidos: [null],
      razon_social: [null],
      direccion: [null],
      telefono: [null],
    });
  }

  // Obtener Tipos de Documento
  fnTiposDocumento() {
    this._service2.getListaTipoDocumento().subscribe( (data) => {
      if (data) {
        this.lTipoDocumento = data;
        this.formCliente.get('tipo_documento_id')?.patchValue(this.lTipoDocumento[0].id);
        this.nro_longitud = this.lTipoDocumento[0].long_tipo_doc;
        this.formCliente.get('nro_documento')?.addValidators([Validators.minLength(this.nro_longitud),Validators.maxLength(this.nro_longitud)])
      }
    })
  }

  // Obtener Longitud de Tipo de Documento
  fnObtenerLongitud() {

    const idTipoDoc: number = this.formCliente.get('tipo_documento_id')?.value;

    this.nro_longitud = this.lTipoDocumento.find( t => t.id == idTipoDoc )?.long_tipo_doc ?? 0;

    this.formCliente.get('nro_documento')?.patchValue(null)
    this.formCliente.get('nro_documento')?.clearValidators();
    this.formCliente.get('nro_documento')?.updateValueAndValidity();
    this.formCliente.get('nro_documento')?.setValidators([Validators.required,Validators.minLength(this.nro_longitud),Validators.maxLength(this.nro_longitud)])
    this.formCliente.get('nro_documento')?.updateValueAndValidity();

    //
    this.formCliente.get('nombres')?.patchValue(null);
    this.formCliente.get('apellidos')?.patchValue(null);
    this.formCliente.get('razon_social')?.patchValue(null);
    this.formCliente.get('direccion')?.patchValue(null);
    this.formCliente.get('telefono')?.patchValue(null);

  }

  fnConsultarDocumento(event: any) {
    if (event.keyCode === 13) {

      if (this.formCliente.get('nro_documento')?.invalid) {
        return;
      }

      const idTipoDoc: number = this.formCliente.get('tipo_documento_id')?.value;
      const nroDocumento = this.formCliente.get('nro_documento')?.value.trim();
      const codTipoDoc = this.lTipoDocumento.find( t => t.id == idTipoDoc )?.cod_tipo_doc;

      if (codTipoDoc === '01') { // DNI

        this._serviceConsulta.fnConsultaDniSunat(nroDocumento).subscribe( (data) => {
          if (data) {
            if (data.success) {
              // completar datos
              this.formCliente.get('nombres')?.setValue(data.nombres);
              this.formCliente.get('apellidos')?.setValue(data.apellidoPaterno+' '+data.apellidoMaterno);
            } else {
              Swal.fire({
                icon: 'warning',
                title: data.message
              })
              this.formCliente.get('nombres')?.patchValue(null);
              this.formCliente.get('apellidos')?.patchValue(null);
            }
          }
        })

      } else if(codTipoDoc === '06') { // RUC

        this._serviceConsulta.fnConsultarRucSunat(nroDocumento).subscribe( (data) => {
          if (data) {
            if (data.success) {
              Swal.fire({
                icon: 'warning',
                title: data.message
              })
              this.formCliente.get('razon_social')?.patchValue(null);
              this.formCliente.get('direccion')?.patchValue(null);
              this.formCliente.get('telefono')?.patchValue(null);
            } else {
              // completar datos
              this.formCliente.get('razon_social')?.patchValue(data.razonSocial);
              this.formCliente.get('direccion')?.patchValue(data.direccion);
            }
          }
        })

      } else { // OTROS
        Swal.fire({
          icon: 'warning',
          title: 'Este tipo de documento no se puede consultar'
        })
        return;
      }

    }
  }

  //
  fnGuardarCliente() {

    if (this.formCliente.invalid) {
      return Object.values(this.formCliente.controls).forEach(control => {
          if (control instanceof FormGroup) {
              Object.values(control.controls).forEach(control => control.markAsTouched())
          } else {
              control.markAsTouched()
          }
      })
    }

    // Data
    const form = this.formCliente.value;

    const data = {
      tipo_documento_id: form.tipo_documento_id,
      nro_documento: form.nro_documento,
      nombres: form.nombres,
      apellidos: form.apellidos,
      razon_social: form.razon_social,
      direccion: form.direccion,
      telefono: form.telefono
    }

    this._service.postCrearCliente(data).subscribe( (data) => {
      if (data.id) {
        Swal.fire({
          icon: 'success',
          title: 'Se registro correctamente el cliente'
        });
        this.modal.close();
        this.modalClienteAdd.emit(data);
      }
    })

  }

}
