import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UnidadMedida } from '../interfaces/unidad-medida.interface';
import { UnidadMedidaService } from './services/unidad-medida.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroUnidadMedidaComponent } from './components/registro-unidad-medida/registro-unidad-medida.component';
import { EditarUnidadMedidaComponent } from './components/editar-unidad-medida/editar-unidad-medida.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-unidad-medida',
  templateUrl: './unidad-medida.component.html',
  styleUrls: ['./unidad-medida.component.css']
})
export class UnidadMedidaComponent implements OnInit {

  //#region Tabla
  dataSource!: MatTableDataSource<UnidadMedida>;
  displayedColumns: string[] = ['opcion',  'name', 'abreviatura', 'equivalencia', 'state_name', 'eliminar'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _service: UnidadMedidaService,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fnListaUnidadMedida();
  }

  // Filtro de Tabla
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Listar Categorias
  fnListaUnidadMedida() {
    this._service.getListarUnidadMedida().subscribe( (resp: UnidadMedida[]) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // Crear Unidad Medida
  fnOpenCrearUnidadMedida() {
    const modalRef = this.modelService.open(RegistroUnidadMedidaComponent, {centered: true, backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalUnidadMedidaAdd.subscribe( (resp: UnidadMedida) => {
      if (resp) {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Editar Unidad Medida
  fnOperEditarUnidadMedida(data: UnidadMedida) {
    const modalRef = this.modelService.open(EditarUnidadMedidaComponent, {centered: true, backdrop: 'static'});
    modalRef.componentInstance.uniadad_medida_edit = data;
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalUnidadMedidaEdit.subscribe( (resp: UnidadMedida) => {
      if (resp) {
        let index = this.dataSource.data.findIndex(d => d.id === resp.id);
        this.dataSource.data[index] = resp;
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Cambiar Estado
  fnDarBajaORAltaUnidadMedida(unidad: UnidadMedida, isBaja: boolean) {

    let title = `¿Seguro de dar de ${!isBaja ? 'Baja' : 'Alta'} a ${unidad.name.trim()}`

    let Estado = isBaja ? 1 : 2;

    Swal.fire({
      icon: 'question',
      title: title,
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then( (swal) => {
      if (swal.isConfirmed) {
        const data = {
          state: Estado
        }
        this._service.postEstadoUnidadMedida(data, unidad.id).subscribe( ({message}) => {
          if (message === 'true') {
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado correctamente'
            })
            this.dataSource.data.find(u => u.id === unidad.id)!.state = Estado;
            if (isBaja) {
              this.dataSource.data.find(u => u.id === unidad.id)!.state_name = 'Activo';
            } else {
              this.dataSource.data.find(u => u.id === unidad.id)!.state_name = 'Desactivado';
            }
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })

  }

  // Eliminar
  fnEliminarUnidadMedida(id: number) {
    Swal.fire({
      icon: 'question',
      title: '¿Seguro de eliminar esta Unidad de Medida?',
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then( (swal) => {
      if (swal.isConfirmed) {
        this._service.deleteUnidaMedida(id).subscribe( ({message}) => {
          if (message) {
            Swal.fire({
              icon: 'success',
              title: message
            });
            let index = this.dataSource.data.findIndex(d => d.id === id);
            this.dataSource.data.splice(index,1);
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })
  }

}
