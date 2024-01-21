import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductoAgregarComponent } from '../producto-agregar/producto-agregar.component';
import { PosService } from '../../services/pos.service';
import { DetailUnidadMedida } from 'src/app/config/service/general.interface';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-product-pos-venta',
  templateUrl: './product-pos-venta.component.html',
  styleUrls: ['./product-pos-venta.component.css']
})
export class ProductPosVentaComponent implements OnInit {

  constructor(
    private modelService: NgbModal,
    public _service: PosService
    ) { }

  ngOnInit(): void {
  }

  // Dialog para Agregar Producto
  fnBuscarProductoDialog() {
    const modalRef = this.modelService.open(ProductoAgregarComponent, {centered: true, size: 'xl', backdrop: 'static'});
    modalRef.result.then(
      () => {},
      () => {}
    )
    modalRef.componentInstance.modalproductoSelect.subscribe( (resp:any) => {
      if (resp) {

      }
    })
  }

  // Cambio Unidad Medidad
  onChangeUnidadMedida(event: DetailUnidadMedida, item: FormGroup | any) {

    // colocamos la cantidad por la unidad escogidad
    item.controls['cantidad'].patchValue(event.cantidad_unidad)
    // colocamos la precio por la unidad escogidad
    item.controls['precio'].patchValue(event.precio_venta_cantidad)
    // subtotal
    item.controls['subtotal'].patchValue(event.precio_venta_cantidad)

  }

}
