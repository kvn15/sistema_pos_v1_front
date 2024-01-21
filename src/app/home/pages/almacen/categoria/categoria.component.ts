import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria } from '../interfaces/categoria.interface';
import { CategoriaService } from './services/categoria.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroCategoriaComponent } from './components/registro-categoria/registro-categoria.component';
import { EditarCategoriaComponent } from './components/editar-categoria/editar-categoria.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {

  //#region Tabla
  dataSource!: MatTableDataSource<Categoria>;
  displayedColumns: string[] = ['opcion',  'name', 'state_name'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _service: CategoriaService,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fnListaCategoria();
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
  fnListaCategoria() {
    this._service.getListarCategorias().subscribe( (resp: Categoria[]) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // Dialog para Crear
  fnOpenCrearCategoria() {
    const modalRef = this.modelService.open(RegistroCategoriaComponent, {centered: true, backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalCategorieAdd.subscribe( (resp:any) => {
      if (resp) {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Dialog para Editar
  fnOperEditarCategoria(data: Categoria) {
    const modalRef = this.modelService.open(EditarCategoriaComponent, {centered: true, backdrop: 'static'});
    modalRef.componentInstance.categoria_edit = data;
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalCategorieEdit.subscribe( (resp: Categoria) => {
      if (resp) {
        let index = this.dataSource.data.findIndex(d => d.id === resp.id);
        this.dataSource.data[index] = resp;
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Dar de Baja o Alta
  fnDarBajaORAltaCategoria(categoria: Categoria, isBaja: boolean) {

    let title = `¿Seguro de dar de ${!isBaja ? 'Baja' : 'Alta'} a ${categoria.name.trim()}`

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
        this._service.postEstadoCategoria(data, categoria.id).subscribe( ({message}) => {
          if (message === 'true') {
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado correctamente'
            })
            this.dataSource.data.find(u => u.id === categoria.id)!.state = Estado;
            if (isBaja) {
              this.dataSource.data.find(u => u.id === categoria.id)!.state_name = 'Activo';
            } else {
              this.dataSource.data.find(u => u.id === categoria.id)!.state_name = 'Desactivado';
            }
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })

  }


}
