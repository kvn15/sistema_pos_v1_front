import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from '../interfaces/Proveedor.interface';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProveedorService } from './services/proveedor.service';
import { RegistroProveedorComponent } from './components/registro-proveedor/registro-proveedor.component';
import { EditarProveedorComponent } from './components/editar-proveedor/editar-proveedor.component';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit {

  //#region Tabla
  dataSource!: MatTableDataSource<Proveedor>;
  displayedColumns: string[] = ['opcion',  'ruc', 'razon_social', 'email', 'celular', 'state_name'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _service: ProveedorService,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fnListaProveedor();
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
  fnListaProveedor() {
    this._service.getListarProveedor().subscribe( (resp: Proveedor[]) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // Dialog para Crear
  fnOpenCrearProveedor() {
    const modalRef = this.modelService.open(RegistroProveedorComponent, {centered: true, size: 'lg', backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalProveedorAdd.subscribe( (resp:any) => {
      if (resp) {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Dialog para Editar
  fnOperEditarProveedor(data: Proveedor) {
    const modalRef = this.modelService.open(EditarProveedorComponent, {centered: true, size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.proveedor_edit = data;
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalProveedorEdit.subscribe( (resp: Proveedor) => {
      if (resp) {
        let index = this.dataSource.data.findIndex(d => d.id === resp.id);
        this.dataSource.data[index] = resp;
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Dar de Baja o Alta
  fnDarBajaORAltaProveedor(proveedor: Proveedor, isBaja: boolean) {

    let title = `¿Seguro de dar de ${!isBaja ? 'Baja' : 'Alta'} a ${proveedor.razon_social.trim()}`

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
        this._service.postEstadoProveedor(data, proveedor.id).subscribe( ({message}) => {
          if (message === 'true') {
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado correctamente'
            })
            this.dataSource.data.find(u => u.id === proveedor.id)!.state = Estado;
            if (isBaja) {
              this.dataSource.data.find(u => u.id === proveedor.id)!.state_name = 'Activo';
            } else {
              this.dataSource.data.find(u => u.id === proveedor.id)!.state_name = 'Desactivado';
            }
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })
  }


}
