import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from './interfaces/cliente.interface';
import { ClienteService } from './service/cliente.service';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistroClienteComponent } from './components/registro-cliente/registro-cliente.component';
import { EditarClienteComponent } from './components/editar-cliente/editar-cliente.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  //#region Tabla

  dataSource!: MatTableDataSource<Cliente>;
  displayedColumns: string[] = ['opcion', 'abrev_tipo_doc', 'nro_documento', 'nombres', 'apellidos', 'razon_social'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _service: ClienteService,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fnListarClientes();
  }

  // Listar Cliente
  fnListarClientes() {
    this._service.getListarCliente().subscribe( (data) => {
      this.dataSource = new MatTableDataSource(data);
      console.log(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  // Filtro de Tabla
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // Dialog para Crear un Cliente
  fnOpenCrearCliente() {
    const modalRef = this.modelService.open(RegistroClienteComponent, {centered: true, size: 'xl', backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalClienteAdd.subscribe( (resp:any) => {
      if (resp) {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Dialog para Editar Cliente
  fnOperEditarUsuario(data: Cliente) {
    const modalRef = this.modelService.open(EditarClienteComponent, {centered: true, size: 'xl', backdrop: 'static'});
    modalRef.componentInstance.cliente_edit = data;
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalClienteEdit.subscribe( (resp: any) => {
      if (resp) {
        let index = this.dataSource.data.findIndex(d => d.id === resp.id);
        this.dataSource.data[index] = resp;
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Eliminar Cliente
  fnEliminarCliente(data: Cliente) {
    Swal.fire({
      icon: 'question',
      title: '¿Seguro(a) de eliminar este cliente?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then( (swal) => {
      if (swal.isConfirmed) {
        this._service.deleteEliminarCliente(data.id).subscribe( (response) => {
          if (response.success) {
            Swal.fire({
              icon: 'success',
              title: 'Se elimino correctamente el Cliente'
            });

            // Actualizamos la tabla
            const index = this.dataSource.data.findIndex( d => d.id === data.id );
            this.dataSource.data.splice(index,1);
            this.dataSource._updateChangeSubscription();

          }
        })
      }
    })
  }

}
