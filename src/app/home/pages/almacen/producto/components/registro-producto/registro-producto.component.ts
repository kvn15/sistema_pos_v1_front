import { Component, OnInit } from '@angular/core';
import { Select2Data } from 'ng-select2-component';
import { DataComboxProducto, GeneralProducto, TributoSunat, Proveedor, UnidadMedida  } from '../../../interfaces/producto.interface';
import { GeneralService } from '../../../../../../config/service/general.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { API_URL_BACK_GENERAL } from 'src/app/config/config';


@Component({
  selector: 'app-registro-producto',
  templateUrl: './registro-producto.component.html',
  styleUrls: ['./registro-producto.component.css']
})
export class RegistroProductoComponent implements OnInit {

  // bEditarProducto y nIdProducto
  bEditarProducto: boolean = false;
  nIdProducto: number = 0;
  //

  URL_BACKEND:any = API_URL_BACK_GENERAL+'storage/';
  //
  lComboxGeneral!: DataComboxProducto;
  lTipoProducto: GeneralProducto[] = [];
  lCategoria: GeneralProducto[] = [];
  lProveedor: Proveedor[] = [];
  lTributoSunat: TributoSunat[] = [];
  lUnidadMedida: UnidadMedida[] = [];
  lLaboratorio: GeneralProducto[] = [];
  lMarca: GeneralProducto[] = [];

  //
  formProducto!: FormGroup;

  //
  bHabilitarMarca: boolean = false;
  bHabilitarLaboratorio: boolean = false;

  //
  url_imagen: string = 'assets/img/products/producto-no-imagen.jpg';
  imagen_previsualiza: any = this.url_imagen;
  imagen_file: any = null;

  constructor(
    private _service: ProductoService,
    private _serviceGeneral: GeneralService,
    private _fb: FormBuilder,
    private _router: Router,
    private _activedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fnFormularioProducto();
    this.fnListaCombox();
    this.fnRellenarDatosProducto();
  }

  // Obtener Lista para los Combox
  fnListaCombox() {
    this._serviceGeneral.getListaCombox().subscribe( (data: any) => {
      if (typeof data[0].marca == 'undefined') {
        const tipo_producto = data[0].tipo_producto;
        const categoria = data[1].categoria;
        const proveedor = data[2].proveedor;
        const tributo_sunat = data[3].tributo_sunat;
        const unidad_medida = data[4].unidad_medida;
        const laboratorio = data[5].laboratorio;
        const marca = data[6].marca;
        this.lTipoProducto = tipo_producto!;
        this.lCategoria = categoria!;
        this.lProveedor = proveedor!;
        this.lTributoSunat = tributo_sunat!;
        this.lUnidadMedida = unidad_medida!;
        this.lLaboratorio = laboratorio!;
        this.lMarca = marca!;
      }
    })
  }

  // Formulario Producto
  fnFormularioProducto() {
    this.formProducto = this._fb.group({
      nIdProducto: [null],
      tipo_producto_id: ['1'],
      categoria_id: [null, [Validators.required]],
      codigo_barras: [null, [Validators.required]],
      nombre_producto: [null, [Validators.required]],
      detalle_producto: [null, [Validators.required]],
      provedor_id: [null],
      stock_inicial: [null, [Validators.required]],
      stock_limite: [null, [Validators.required]],
      price_compra: [null],
      tributo_sunat_id: ['1', [Validators.required]],
      imagen_producto: [null],
      presentacion: [null],
      registro_sanitario: [null],
      lote: [null],
      fecha_vencimiento: [null],
      marca_id: [null],
      marca_otro: [null],
      laboratorio_id: [null],
      laboratorio_otro: [null],
      principio_activo: [null],
      state: [1],
      state_name: ['Activo'],
      array_unidad_medida: this._fb.array([])
    });

    this.arrayFormUnidadMedida.controls.push(this._fb.group({
      id: [null],
      unidad_medida_id: [null],
      cantidad_unidad: [null],
      precio_venta_cantidad: [null]
    }))
  }


  // Metodo get
  public get arrayFormUnidadMedida(): FormArray {
    return this.formProducto.get('array_unidad_medida') as FormArray;
  }

  // Agregar nueva Unidad Medida
  fnAgregarUnidadMedida() {
    const form = this._fb.group({
      id: [null],
      unidad_medida_id: [null],
      cantidad_unidad: [null],
      precio_venta_cantidad: [null]
    });
    this.arrayFormUnidadMedida.controls.push(form);
  }

  // Eliminar la unidad Agregada
  fnEliminarUnidad(index: number) {
    const control = <FormArray>this.formProducto.controls["array_unidad_medida"];
    control.removeAt(index);
  }

  // Validar Unidad de Medida ya fue Escogida
  fnValidadUnidadMedida(evento: any, index: any) {
    const existe = this.arrayFormUnidadMedida.controls.filter( (item, i) => i !== index).filter( item => item.value.unidad_medida_id === evento);
    if (existe.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'La unidad de medida seleccionada ya se encuentra escogida.'
      })
      this.arrayFormUnidadMedida.controls.at(index)?.get('unidad_medida_id')?.patchValue(null);
      return;
    }
    const equivalencia = this.lUnidadMedida.find( u => u.id === evento)?.equivalencia;
    this.arrayFormUnidadMedida.controls.at(index)?.get('cantidad_unidad')?.patchValue(equivalencia)
  }

  // SI ESCOGEN OTROS MARCA O LABORATORIO
  fnChangeOtrosMarcaLaboratorio(valor: any, isMarca: boolean) {
    if (isMarca) {
      //Es Marca
      if (valor == "0") {
        this.bHabilitarMarca = true;
      } else {
        this.bHabilitarMarca = false;
      }
    } else {
      //Es Laboratorio
      if (valor == "0") {
        this.bHabilitarLaboratorio = true;
      } else {
        this.bHabilitarLaboratorio = false;
      }
    }
  }

  // Previsualizar Imagen
  fnProcesarImagen($event: any) {
    const maxMB = 4000000 //4 MB
    if ($event.target.files[0].type !== 'image/png' && $event.target.files[0].type !== 'image/jpeg' && $event.target.files[0].type !== 'image/jpg') {
      Swal.fire({
        icon: 'warning',
        title: 'El archivo no es una imagen.'
      });
      return;
    }
    if ($event.target.files[0].size > maxMB) {
      Swal.fire({
        icon: 'warning',
        title: 'La imagen supera el tamaño maximo de MB(4 MB Max.)'
      });
      return;
    }
    this.imagen_file = $event.target.files[0];
    let reader = new FileReader(); //Nos permite leer el archivo
    reader.readAsDataURL(this.imagen_file); //lees este archivo
    reader.onload = () => this.imagen_previsualiza = reader.result; //guardame la imagen en base 64

    // Si es Editar se sube la imagen al back y se guarda
    if (this.bEditarProducto) {

      const formData = new FormData();
      formData.append('id', this.nIdProducto.toString())
      formData.append('imagen_producto', this.imagen_file)

      this._service.postSubirFotoProducto(formData).subscribe( ({success}) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: 'Se actualizo correctamente la imagen'
          });
        }
      })

    }
  }

  // Quitar Imagen Subida
  fnQuitarImagen() {
    if (this.bEditarProducto) {

      Swal.fire({
        icon: 'question',
        title: '¿Seguro de Quitar la imagen del Producto?',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
      }).then((swal) => {
        if (swal.isConfirmed) {
          const formData = new FormData();
          formData.append('id', this.nIdProducto.toString())
          formData.append('imagen_productos', 'null')

          this._service.postSubirFotoProducto(formData).subscribe( ({success}) => {
            if (success) {
              this.imagen_previsualiza = this.url_imagen;
              this.imagen_file = null;
              Swal.fire({
                icon: 'success',
                title: 'Se quito correctamente la imagen'
              });
            }
          })
        }
      })

    } else {
      this.imagen_previsualiza = this.url_imagen;
      this.imagen_file = null;
    }
  }

  // Regresar a Lista
  fnRegresarLista() {
    this._router.navigate(['articulos/productos'])
  }

  //
  fnGuardarProducto() {

    const form = this.formProducto.controls;
    const unidad_medida_details = this.arrayFormUnidadMedida.controls.filter( item => item.value.unidad_medida_id !== null)

    if (this.formProducto.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Hay campos obligatorios que faltan completar',
        text: 'Tener en cuenta que todos los campos con * son obligatorios.'
      });
      return;
    }

    if (unidad_medida_details.length == 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Hay campos obligatorios que faltan completar',
        text: 'Tener en cuenta que todos los campos con * son obligatorios.'
      });
      return;
    }

    if ((form['marca_id'].value == '0' && !form['marca_otro'].value)
        || (form['laboratorio_id'].value == '0' && !form['laboratorio_otro'].value)) {
      Swal.fire({
        icon: 'warning',
        title: 'Hay campos obligatorios que faltan completar',
        text: 'Tener en cuenta que todos los campos con * son obligatorios.'
      });
      return;
    }

    const detalleUnidad = this.arrayFormUnidadMedida.controls;

    for (let i = 0; i < detalleUnidad.length; i++) {
      const element = detalleUnidad[i].value;
      if (!element.unidad_medida_id || !element.cantidad_unidad || !element.precio_venta_cantidad) {
        Swal.fire({
          icon: 'warning',
          title: 'Hay campos obligatorios que faltan completar',
          text: 'Tener en cuenta que todos los campos con * son obligatorios.'
        });
        return;
      }
      if (element.cantidad_unidad <= 0 || element.precio_venta_cantidad <= 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Los campos numericos de Cantidad o Precio de Venta no deben ser menor o igual a 0 '
        });
        return;
      }
    }


    const sUnidadMedidadDetails =  unidad_medida_details.map(item => {
      return `${item.value.unidad_medida_id}|${item.value.cantidad_unidad}|${item.value.precio_venta_cantidad}`
    });

    const data = {
      tipo_producto_id: form['tipo_producto_id'].value,
      categoria_id: form['categoria_id'].value,
      codigo_barras: form['codigo_barras'].value,
      nombre_producto: form['nombre_producto'].value,
      detalle_producto: form['detalle_producto'].value,
      provedor_id: form['provedor_id'].value,
      stock_inicial: form['stock_inicial'].value,
      stock_limite: form['stock_limite'].value,
      price_compra: form['price_compra'].value,
      tributo_sunat_id: form['tributo_sunat_id'].value,
      presentacion: form['presentacion'].value,
      registro_sanitario: form['registro_sanitario'].value,
      lote: form['lote'].value,
      fecha_vencimiento: form['fecha_vencimiento'].value,
      marca_id: form['marca_id'].value == '0' ? null : form['marca_id'].value,
      marca_otro: form['marca_otro'].value,
      laboratorio_id: form['laboratorio_id'].value == '0' ? null : form['laboratorio_id'].value,
      laboratorio_otro: form['laboratorio_otro'].value,
      principio_activo: form['principio_activo'].value,
      detail_unidad: sUnidadMedidadDetails.join(','),
    }

    if (!this.bEditarProducto) {
      this._service.postRegistrarProducto(data).subscribe( ({message, success, data}) => {
        console.log(message, success, data)
        if (success) {
          const formData = new FormData();
          formData.append('id', data)
          formData.append('imagen_producto', this.imagen_file)
          this._service.postSubirFotoProducto(formData).subscribe( ({success}) => {
            if (success) {
              Swal.fire({
                icon: 'success',
                title: message
              });
              this.fnRegresarLista();
            }
          })
        }
      })
    } else {
      this._service.putEditarProducto(data, this.nIdProducto).subscribe( ({message, success, data}) => {
        if (success) {
          Swal.fire({
            icon: 'success',
            title: message
          });
        }
      })
    }
  }

  // Metodos editar
  fnRellenarDatosProducto() {
    this._activedRoute.params.subscribe( (param: any) => {
      if (Object.keys(param).length > 0) {
        this.fnObtenerDatos(param.id);
        this.bEditarProducto = true;
        this.nIdProducto = param.id;
      } else {
        this.bEditarProducto = false;
        this.nIdProducto = 0;
      }
    })
  }

  // Obtener datos
  fnObtenerDatos(id: number) {
    this._service.getObtenerProducto(id).subscribe((data) => {
      console.log(data)
      this.formProducto.patchValue(data);
      // validar marca y proveedor
      if (data.laboratorio_otro) {
        this.bHabilitarLaboratorio = true;
        this.formProducto.controls['laboratorio_id'].setValue('0')
      }
      if (data.marca_otro) {
        this.bHabilitarMarca = true;
        this.formProducto.controls['marca_id'].setValue('0')
      }
      // rellenar imagen
      if (!data.imagen_producto) {
        this.imagen_previsualiza = this.url_imagen;
      } else {
        this.imagen_previsualiza = this.URL_BACKEND + data.imagen_producto;
      }

      // remover primer control
      const control = <FormArray>this.formProducto.controls["array_unidad_medida"];
      control.removeAt(0);
      // Rellenar Unidades y precio
      data.details_product.forEach( d => {
        const form = this._fb.group({
          id: [d.id],
          unidad_medida_id: [d.unidad_medida_id],
          cantidad_unidad: [d.cantidad_unidad],
          precio_venta_cantidad: [d.precio_venta_cantidad]
        });
        this.arrayFormUnidadMedida.controls.push(form)
      })

    })
  }

}
