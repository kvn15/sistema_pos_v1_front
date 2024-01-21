import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriaService } from '../../services/categoria.service';
import { FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-categoria',
  templateUrl: './registro-categoria.component.html',
  styleUrls: ['./registro-categoria.component.css']
})
export class RegistroCategoriaComponent implements OnInit {

  @Output() modalCategorieAdd: EventEmitter<any> = new EventEmitter<any>();

  // form
  frmCategoria = new FormControl('', [Validators.required, Validators.maxLength(250)]);

  constructor(
    public modal: NgbActiveModal,
    private _service: CategoriaService,
  ) { }

  ngOnInit(): void {
  }

  // Guardar Cateogira
  fnGuardarCategoria() {

    const frmCategoria = this.frmCategoria;

    if (frmCategoria.hasError('required')) {
      Swal.fire({
        icon: 'warning',
        title: 'La Descripción es obligatoria.'
      });
      return
    }

    if (frmCategoria.hasError('maxlength')) {
      Swal.fire({
        icon: 'warning',
        title: 'Se Supero el maximo de caractes para la Descripción (Max 250)'
      });
      return;
    }

    const data = {
      name: frmCategoria.value?.trim().toLocaleUpperCase()
    }

    this._service.postCreatCategoria(data).subscribe(({message, data}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalCategorieAdd.emit(data);
      }
    })

  }

}
