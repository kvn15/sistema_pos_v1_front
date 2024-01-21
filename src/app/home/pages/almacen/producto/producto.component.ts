import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductoService } from './services/producto.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from '../interfaces/producto.interface';
import { Router } from '@angular/router';
import { API_URL_BACK_GENERAL } from 'src/app/config/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  URL_BACKEND:any = API_URL_BACK_GENERAL+'storage/';

  //#region Tabla
  dataSource!: MatTableDataSource<Producto>;
  displayedColumns: string[] = ['opcion',  'codigo_barras', 'nombre_producto','categoria', 'stock_inicial', 'stock_limite', 'price_venta', 'price_compra', 'proveedor', 'fecha_vencimiento', 'imagen_producto', 'state_name'];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //#endregion

  constructor(
    private _service: ProductoService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.fnListarProductos();
  }

  // Filtro de Tabla
  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  // listar
  fnListarProductos() {
    this._service.getListarProductos().subscribe( (data) => {
      console.log(data.data)
      this.dataSource = new MatTableDataSource(data.data);
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort;
    })
  }

  // Dar de baja o alta
  fnDarBajaORAltaProducto(producto: Producto, isBaja: boolean) {

    let title = `¿Seguro de dar de ${!isBaja ? 'Baja' : 'Alta'} a ${producto.nombre_producto.trim()}`

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
        this._service.postEstadoProducto(data, producto.id).subscribe( ({message}) => {
          if (message === 'true') {
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado correctamente'
            })
            this.dataSource.data.find(u => u.id === producto.id)!.state = Estado;
            if (isBaja) {
              this.dataSource.data.find(u => u.id === producto.id)!.state_name = 'Activo';
            } else {
              this.dataSource.data.find(u => u.id === producto.id)!.state_name = 'Desactivado';
            }
            this.dataSource._updateChangeSubscription();
          }
        })
      }
    })

  }

  // Cargar Productos
  fnCargarProductos() {
    this._router.navigate(['articulos/cargar-producto'])
  }

  // Registrar Producto
  fnRutaRegistroProducto() {
    this._router.navigate(['articulos/registro-producto'])
  }

  fnEditarProducto(id: number) {
    this._router.navigate(['articulos/editar-producto/'+id])
  }

}
