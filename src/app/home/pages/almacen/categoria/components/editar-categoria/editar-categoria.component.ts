import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../../interfaces/categoria.interface';

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent implements OnInit {

  @Output() modalCategorieEdit: EventEmitter<any> = new EventEmitter<any>();
  @Input() categoria_edit!: Categoria;

  // form
  frmCategoria = new FormControl('', [Validators.required, Validators.maxLength(250)]);

  constructor(
    public modal: NgbActiveModal,
    private _service: CategoriaService,
  ) { }

  ngOnInit(): void {
    this.frmCategoria.setValue(this.categoria_edit.name)
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

    this._service.putEditarCategoria(data, this.categoria_edit.id).subscribe(({message, data}) => {
      if (data) {
        Swal.fire({
          icon: 'success',
          title: message
        });
        this.modal.close();
        this.modalCategorieEdit.emit(data);
      }
    })

  }

}
