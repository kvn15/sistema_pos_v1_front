import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductoVenta } from 'src/app/config/service/general.interface';
import { GeneralService } from 'src/app/config/service/general.service';
import { PosService } from '../../services/pos.service';

@Component({
  selector: 'app-producto-agregar',
  templateUrl: './producto-agregar.component.html',
  styleUrls: ['./producto-agregar.component.css']
})
export class ProductoAgregarComponent implements OnInit, AfterViewInit {

  @Output() modalproductoSelect: EventEmitter<any> = new EventEmitter<any>();

  lListaProductos: ProductoVenta[] = [];

  constructor(
    public modal: NgbActiveModal,
    private _service: GeneralService,
    public _servicePos: PosService
  ) { }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.fnListarProductos();
    });
  }

  ngOnInit(): void {
  }

  // Listar los Productos
  fnListarProductos() {
    this._service.getListaProductosVenta().subscribe( data => {
      if (data) {
        this.lListaProductos = data;
      }
    })
  }

}
