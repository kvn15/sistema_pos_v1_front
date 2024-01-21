import { Component, OnInit, ViewChild } from '@angular/core';
import { TipoComprobanteService } from './service/tipo-comprobante.service';
import { TipoComprobante } from './interfaces/tipo-comprobante.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistraTipoComprobanteComponent } from './components/registra-tipo-comprobante/registra-tipo-comprobante.component';
import { EditarTipoComprobanteComponent } from './components/editar-tipo-comprobante/editar-tipo-comprobante.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-comprobante',
  templateUrl: './tipo-comprobante.component.html',
  styleUrls: ['./tipo-comprobante.component.css']
})
export class TipoComprobanteComponent implements OnInit {

  //#region Tabla

  dataSource!: MatTableDataSource<TipoComprobante>;
  displayedColumns: string[] = ['opcion', 'documento', 'serie', 'numero', 'state_name'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _service: TipoComprobanteService,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fnListaTipoComprobante()
  }

  // Obtener Tipo de comprobantes
  fnListaTipoComprobante() {
    this._service.getListarTipoComprobante().subscribe( (data) => {
      if (data) {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
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

  // Dialog para tipo de comprobante
  fnOpenCrearTipoComprobante() {
    const modalRef = this.modelService.open(RegistraTipoComprobanteComponent, {centered: true, size: 'sm', backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalTComprobanteAdd.subscribe( (resp:any) => {
      if (resp) {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  // Dialog para tipo de comprobante
  fnOperEditarTipoComprobante(data: TipoComprobante) {
    const modalRef = this.modelService.open(EditarTipoComprobanteComponent, {centered: true, size: 'sm', backdrop: 'static'});
    modalRef.componentInstance.tcomprobante_edit = data;
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalTComprobanteEdit.subscribe( (resp:any) => {
      if (resp) {
        let index = this.dataSource.data.findIndex(d => d.id === resp.id);
        this.dataSource.data[index] = resp;
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  //
  fnDarBajaORAltaTipoComprobante(comprobante: TipoComprobante, isBaja: boolean) {

    let title = `¿Seguro de dar de ${!isBaja ? 'Baja' : 'Alta'} a ${comprobante.documento.trim()} - ${comprobante.serie}`

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
          id: comprobante.id,
          state: Estado
        }
        this._service.postChangeEstado(data).subscribe( ({message}) => {
          if (message === 'true') {
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado correctamente'
            })
            this.dataSource.data.find(u => u.id === comprobante.id)!.state = Estado;
            if (isBaja) {
              this.dataSource.data.find(u => u.id === comprobante.id)!.state_name = 'Activo';
            } else {
              this.dataSource.data.find(u => u.id === comprobante.id)!.state_name = 'Desactivado';
            }
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })

  }

}
