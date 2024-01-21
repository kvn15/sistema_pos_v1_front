import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoVenta } from 'src/app/config/service/general.interface';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class PosService {

  formProductos!: FormGroup;

  constructor(
    private _http: HttpClient,
    private _fb: FormBuilder
  ) {
    this.fnFormularioProducto();
  }

  // Generar Formulario
  fnFormularioProducto() {
    this.formProductos = this._fb.group({
      array_producto: this._fb.array([])
    })
  }

  //Metodo get
  get arrayProductoVenta(): FormArray {
    return this.formProductos.get('array_producto') as FormArray;
  }

  // Metodo para Añadir a tabla
  fnAnadirProductoTabla(producto: ProductoVenta) {
    const codigoBarras = producto.codigo_barras;

    const existP = this.arrayProductoVenta.controls.find( c => c.value.codigo_barras === codigoBarras);

    if (existP) {
      Swal.fire({
        icon: 'warning',
        title: 'Este producto ya se encuentra agregado.'
      });
      return;
    }



    const data = this._fb.group({
      id: [producto.id],
      codigo_barras: [producto.codigo_barras],
      nombre_producto: [producto.nombre_producto],
      unidad_medida_id: [null, [Validators.required]],
      unidadMedida: [producto.unidadMedida],
      cantidad: [0, [Validators.required]],
      precio: 0,
      dsct: [0, [Validators.required]],
      subtotal: 0
    })

    //añadir
    this.arrayProductoVenta.controls.push(data);

    Swal.fire({
      icon: 'success',
      title: 'Producto agregado correctamente'
    });
  }

  // Eliminar Producto de la tabla
  fnEliminarLineaTabla(index: number) {
    const control = <FormArray>this.formProductos.controls["array_producto"];
    control.removeAt(index);
  }

}
