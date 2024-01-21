import { Component, OnInit } from '@angular/core';
import * as xls from 'xlsx';
import { CargaProducto } from '../../../interfaces/carga-producto.interface';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-cargar-producto',
  templateUrl: './cargar-producto.component.html',
  styleUrls: ['./cargar-producto.component.css']
})
export class CargarProductoComponent implements OnInit {

  dataProducto: CargaProducto[] = [];

  formExcel!: FormGroup;

  //
  codigo_envio: string = '';

  constructor(
    private _fb: FormBuilder,
    private _service: ProductoService
  ) { }

  ngOnInit(): void {
    this.formExcel = this._fb.group({
      excel_array: this._fb.array([])
    })
  }

  //get
  get arrayFormExcel(): FormArray {
    return this.formExcel.get('excel_array') as FormArray;
  }

  // llenar
  fnRellenarArrayForm(dataProducto: CargaProducto[]) {
    dataProducto.forEach( data => {
      const form: CargaProducto = {
        codigo_barras: data.codigo_barras,
        tipo_producto: data.tipo_producto,
        categoria: data.categoria,
        nombre_producto: data.nombre_producto,
        detalle_producto: data.detalle_producto,
        proveedor_ruc: data.proveedor_ruc,
        stock_inicial: data.stock_inicial,
        stock_limite: data.stock_limite,
        price_compra: data.price_compra,
        tributo: data.tributo,
        presentacion: data.presentacion,
        registro_sanitario: data.registro_sanitario,
        lote: data.lote,
        fecha_vencimiento: data.fecha_vencimiento,
        marca: data.marca,
        laboratorio: data.laboratorio,
        principio_activo: data.principio_activo,
        detalle_unidad: data.detalle_unidad,
        bCodigoBarra: false
      }
      this.arrayFormExcel.controls.push(this._fb.group({
        ...form
      }))
    })
  }

  // Leer Excel
  fnLeerExcel(event: any) {

    // borramos
    this.dataProducto = [];
    this.arrayFormExcel.controls = [];

    const file = event.target.files[0];
    let fr = new FileReader();

    fr.readAsArrayBuffer(file);

    fr.onload = () => {

      let data = fr.result;
      let workbook = xls.read(data, {type: 'array'})
      const sheetname = workbook.SheetNames[0];
      const sheet1 = workbook.Sheets[sheetname];
      this.dataProducto = xls.utils.sheet_to_json(sheet1, {raw: true});

      if (this.dataProducto.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'El archivo EXCEL cargado esta en blanco'
        })
        // borramos
        this.dataProducto = [];
        this.arrayFormExcel.controls = [];
        return;
      }
      if (!this.dataProducto[0].codigo_barras) {
        Swal.fire({
          icon: 'warning',
          title: 'El archivo EXCEL es invalido'
        })
        // borramos
        this.dataProducto = [];
        this.arrayFormExcel.controls = [];
        return;
      }
      this.fnRellenarArrayForm(this.dataProducto);
    }

  }

  // Guardar Productos
  fnGuardar() {

    const codigos: [] = this.arrayFormExcel.value.map((ele: any) => {
      return ele.codigo_barras
    })

    this.codigo_envio = codigos.join('|');

    const data = {
      codigos_barra: this.codigo_envio
    }

    this._service.postValidarCodigoBarra(data).subscribe((resp: string[])=> {
      if (resp.length > 1) {

        resp.forEach( r => {
          this.arrayFormExcel.controls.find( c => c.get('codigo_barras')?.value === r )?.get('bCodigoBarra')?.patchValue(true);
        })

        // mensaje
        Swal.fire({
          icon: 'warning',
          title: 'Existen ' + resp.length + ' codigo(s) de barra(s) que se encuentra registradas en nuestra base de datos'
        })

      } else {

      }
    });
  }

}
