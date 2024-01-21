import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { UnidadMedidaService } from '../../services/unidad-medida.service';
import { UnidadMedida } from '../../../interfaces/unidad-medida.interface';

@Component({
  selector: 'app-editar-unidad-medida',
  templateUrl: './editar-unidad-medida.component.html',
  styleUrls: ['./editar-unidad-medida.component.css']
})
export class EditarUnidadMedidaComponent implements OnInit {

  @Output() modalUnidadMedidaEdit: EventEmitter<any> = new EventEmitter<any>();
  @Input() uniadad_medida_edit!: UnidadMedida;

  frmUnidadMedida!: FormGroup;

  constructor(
    public modal: NgbActiveModal,
    private _service: UnidadMedidaService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.frmUnidadMedida = this._fb.group({
      name: ['', [Validators.required, Validators.maxLength(250)]],
      abreviatura: ['', [Validators.required, Validators.maxLength(50)]],
      equivalencia: [null,[Validators.pattern(/^([0-9]{1,8}(\.[0-9]{1,2})?)$/)]]
    })
    this.frmUnidadMedida.patchValue(this.uniadad_medida_edit)
  }

  // Guardar
  fnGuardarUnidadMedida() {
    if (this.frmUnidadMedida.invalid) {
      return Object.values(this.frmUnidadMedida.controls).forEach(control => {
          if (control instanceof FormGroup) {
              Object.values(control.controls).forEach(control => control.markAsTouched())
          } else {
              control.markAsTouched()
          }
      })
    }

    const form = this.frmUnidadMedida.value;

    const data = {
      name: form.name.trim(),
      abreviatura: form.abreviatura.trim(),
      equivalencia: form.equivalencia,
    }

    this._service.putEditarUnidadMedida(data, this.uniadad_medida_edit.id).subscribe(({message, data}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalUnidadMedidaEdit.emit(data);
      }
    })
  }

}
