import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { TipoComprobanteService } from '../../service/tipo-comprobante.service';
import { TipoComprobante } from '../../interfaces/tipo-comprobante.interface';

@Component({
  selector: 'app-editar-tipo-comprobante',
  templateUrl: './editar-tipo-comprobante.component.html',
  styleUrls: ['./editar-tipo-comprobante.component.css']
})
export class EditarTipoComprobanteComponent implements OnInit, AfterViewInit {

  @Output() modalTComprobanteEdit: EventEmitter<any> = new EventEmitter<any>();
  @Input() tcomprobante_edit!: TipoComprobante;

  frmTComprobante!: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private _service: TipoComprobanteService,
    private _fb: FormBuilder
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fnRellenarDatos();
    });
  }

  ngOnInit(): void {
    this.frmTComprobante = this._fb.group({
      documento: [null, [Validators.required]],
      serie: [null, [Validators.required]],
      numero: [null, [Validators.required]]
    })
  }

  // Rellenar
  fnRellenarDatos() {
    this.frmTComprobante.patchValue(this.tcomprobante_edit);
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
      numero: form.numero ?? 0,
    }

    this._service.putEditTipoComprobante(data, this.tcomprobante_edit.id).subscribe( ({data, message}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        })
        this.modal.close();
        this.modalTComprobanteEdit.emit(data);
      }
    })

  }


}
