import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentoIdentidad } from './interfaces/documento-identidad.interface';
import { DocumentoIdentidadService } from './services/documento-identidad.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegistrarDocumentoIdentidadComponent } from './components/registrar-documento-identidad/registrar-documento-identidad.component';
import { EditarDocumentoIdentidadComponent } from './components/editar-documento-identidad/editar-documento-identidad.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-documento-identidad',
  templateUrl: './documento-identidad.component.html',
  styleUrls: ['./documento-identidad.component.css']
})
export class DocumentoIdentidadComponent implements OnInit {

  //#region Tabla

  dataSource!: MatTableDataSource<DocumentoIdentidad>;
  displayedColumns: string[] = ['opcion', 'cod_tipo_doc', 'tipo_doc', 'abrev_tipo_doc', 'long_tipo_doc'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _service: DocumentoIdentidadService,
    private modelService: NgbModal
  ) { }

  ngOnInit(): void {
    this.fnListaTipoComprobante();
  }

  // Obtener Tipo de comprobantes
  fnListaTipoComprobante() {
    this._service.getListarDocIdentidad().subscribe( (data) => {
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

  // Dialog para Crear Documento de Identidad
  fnOpenCrearDI() {
    const modalRef = this.modelService.open(RegistrarDocumentoIdentidadComponent, {centered: true, size: 'lg', backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalTDocumentoAdd.subscribe( (resp:any) => {
      if (resp) {
        this.dataSource.data.push(resp);
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  //
  fnOperEditarDI(data: DocumentoIdentidad) {
    const modalRef = this.modelService.open(EditarDocumentoIdentidadComponent, {centered: true, size: 'lg', backdrop: 'static'});
    modalRef.componentInstance.tdocumento_edit = data;
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalTDocumentoEdit.subscribe( (resp:any) => {
      if (resp) {
        let index = this.dataSource.data.findIndex(d => d.id === resp.id);
        this.dataSource.data[index] = resp;
        this.dataSource._updateChangeSubscription();
      }
    })
  }

  //
  fnEliminarDI(documento: DocumentoIdentidad) {
    Swal.fire({
      icon: 'info',
      title: '¿Seguro(a) de eliminar el Documento de Identidad?',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar'
    }).then( (swal) => {
      if (swal.isConfirmed) {
        this._service.deleteTipoDocumento( documento.id ).subscribe( ({data, message, success}) => {
          if (success) {
            Swal.fire({
              icon: 'success',
              title: message
            })
            const index = this.dataSource.data.findIndex( d => d.id === documento.id );
            this.dataSource.data.splice(index,1);
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })
  }

}
