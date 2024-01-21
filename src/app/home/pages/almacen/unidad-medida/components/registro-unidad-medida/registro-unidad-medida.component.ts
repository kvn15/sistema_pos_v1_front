import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnidadMedidaService } from '../../services/unidad-medida.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-unidad-medida',
  templateUrl: './registro-unidad-medida.component.html',
  styleUrls: ['./registro-unidad-medida.component.css']
})
export class RegistroUnidadMedidaComponent implements OnInit {

  @Output() modalUnidadMedidaAdd: EventEmitter<any> = new EventEmitter<any>();

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
    console.log(this.frmUnidadMedida)
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

    this._service.postCreatUnidadMedida(data).subscribe(({message, data}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalUnidadMedidaAdd.emit(data);
      }
    })
  }

}
