import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TipoComprobanteService } from '../../service/tipo-comprobante.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registra-tipo-comprobante',
  templateUrl: './registra-tipo-comprobante.component.html',
  styleUrls: ['./registra-tipo-comprobante.component.css']
})
export class RegistraTipoComprobanteComponent implements OnInit {

  @Output() modalTComprobanteAdd: EventEmitter<any> = new EventEmitter<any>();

  frmTComprobante!: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private _service: TipoComprobanteService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.frmTComprobante = this._fb.group({
      documento: [null, [Validators.required]],
      serie: [null, [Validators.required]],
    })
  }

  // Guardar
  fnGuardar() {

    if (this.frmTComprobante.invalid) {
      return Object.values(this.frmTComprobante.controls).forEach(control => {
          if (control instanceof FormGroup) {
              Object.values(control.controls).forEach(control => control.markAsTouched())
          } else {
              control.markAsTouched()
          }
      })
    }

    const form = this.frmTComprobante.value;

    //
    const data = {
      documento: form.documento.trim().toUpperCase(),
      serie: form.serie.trim().toUpperCase(),
    }

    this._service.postCrearTipoComprobante(data).subscribe( ({data, message}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        })
        this.modal.close();
        this.modalTComprobanteAdd.emit(data);
      }
    })

  }

}
