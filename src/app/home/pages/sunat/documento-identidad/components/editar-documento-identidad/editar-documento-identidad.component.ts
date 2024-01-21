import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { DocumentoIdentidadService } from '../../services/documento-identidad.service';
import { DocumentoIdentidad } from '../../interfaces/documento-identidad.interface';

@Component({
  selector: 'app-editar-documento-identidad',
  templateUrl: './editar-documento-identidad.component.html',
  styleUrls: ['./editar-documento-identidad.component.css']
})
export class EditarDocumentoIdentidadComponent implements OnInit {

  @Output() modalTDocumentoEdit: EventEmitter<any> = new EventEmitter<any>();
  @Input() tdocumento_edit!: DocumentoIdentidad;

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
    this.fnRellenarDatos();
  }

  // Rellenar Data
  fnRellenarDatos() {
    this.frmDIdentidad.patchValue(this.tdocumento_edit)
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

    this._service.putEditarTipoDocumento(data, this.tdocumento_edit.id).subscribe( ({success, data, message}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalTDocumentoEdit.emit(data);
      }
    })

  }

}
