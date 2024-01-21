import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DocumentoIdentidadService } from '../../services/documento-identidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registrar-documento-identidad',
  templateUrl: './registrar-documento-identidad.component.html',
  styleUrls: ['./registrar-documento-identidad.component.css']
})
export class RegistrarDocumentoIdentidadComponent implements OnInit {

  @Output() modalTDocumentoAdd: EventEmitter<any> = new EventEmitter<any>();

  // Formulario
  frmDIdentidad!: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private _service: DocumentoIdentidadService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.frmDIdentidad = this._fb.group({
      cod_tipo_doc: [null, [Validators.required]],
      tipo_doc: [null, [Validators.required]],
      abrev_tipo_doc: [null, [Validators.required]],
      long_tipo_doc: [null, [Validators.required]],
    })
  }

  // Guardar Documento Identidad
  fnGuardar() {

    if (this.frmDIdentidad.invalid) {
      return Object.values(this.frmDIdentidad.controls).forEach(control => {
          if (control instanceof FormGroup) {
              Object.values(control.controls).forEach(control => control.markAsTouched())
          } else {
              control.markAsTouched()
          }
      })
    }

    const form = this.frmDIdentidad.value;

    const data = {
      cod_tipo_doc: form.cod_tipo_doc,
      tipo_doc: form.tipo_doc,
      abrev_tipo_doc: form.abrev_tipo_doc,
      long_tipo_doc: form.long_tipo_doc,
    }

    this._service.postCrearTipoDocumento(data).subscribe( ({success, data, message}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalTDocumentoAdd.emit(data);
      }
    })

  }

}
