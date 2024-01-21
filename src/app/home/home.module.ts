import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/Administracion/usuario/usuario.component';
import { RegistroUsuarioComponent } from './pages/Administracion/usuario/components/registro-usuario/registro-usuario.component';
import { EditarUsuarioComponent } from './pages/Administracion/usuario/components/editar-usuario/editar-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriaComponent } from './pages/almacen/categoria/categoria.component';
import { UnidadMedidaComponent } from './pages/almacen/unidad-medida/unidad-medida.component';
import { RegistroCategoriaComponent } from './pages/almacen/categoria/components/registro-categoria/registro-categoria.component';
import { EditarCategoriaComponent } from './pages/almacen/categoria/components/editar-categoria/editar-categoria.component';
import { RegistroUnidadMedidaComponent } from './pages/almacen/unidad-medida/components/registro-unidad-medida/registro-unidad-medida.component';
import { EditarUnidadMedidaComponent } from './pages/almacen/unidad-medida/components/editar-unidad-medida/editar-unidad-medida.component';
import { ProveedorComponent } from './pages/almacen/proveedor/proveedor.component';
import { RegistroProveedorComponent } from './pages/almacen/proveedor/components/registro-proveedor/registro-proveedor.component';
import { EditarProveedorComponent } from './pages/almacen/proveedor/components/editar-proveedor/editar-proveedor.component';
import { ProductoComponent } from './pages/almacen/producto/producto.component';
import { RegistroProductoComponent } from './pages/almacen/producto/components/registro-producto/registro-producto.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { Select2Module } from 'ng-select2-component';
import { CargarProductoComponent } from './pages/almacen/producto/components/cargar-producto/cargar-producto.component';
import { ClienteComponent } from './pages/Administracion/cliente/cliente.component';
import { RegistroClienteComponent } from './pages/Administracion/cliente/components/registro-cliente/registro-cliente.component';
import { EditarClienteComponent } from './pages/Administracion/cliente/components/editar-cliente/editar-cliente.component';
import { TipoComprobanteComponent } from './pages/sunat/tipo-comprobante/tipo-comprobante.component';
import { DocumentoIdentidadComponent } from './pages/sunat/documento-identidad/documento-identidad.component';
import { RegistraTipoComprobanteComponent } from './pages/sunat/tipo-comprobante/components/registra-tipo-comprobante/registra-tipo-comprobante.component';
import { EditarTipoComprobanteComponent } from './pages/sunat/tipo-comprobante/components/editar-tipo-comprobante/editar-tipo-comprobante.component';
import { RegistrarDocumentoIdentidadComponent } from './pages/sunat/documento-identidad/components/registrar-documento-identidad/registrar-documento-identidad.component';
import { EditarDocumentoIdentidadComponent } from './pages/sunat/documento-identidad/components/editar-documento-identidad/editar-documento-identidad.component';
import { PosComponent } from './pages/ventas/pos/pos.component';
import { BoletaComponent } from './pages/ventas/boleta/boleta.component';
import { ProductPosVentaComponent } from './pages/ventas/pos/components/product-pos-venta/product-pos-venta.component';
import { FormPosVentaComponent } from './pages/ventas/pos/components/form-pos-venta/form-pos-venta.component';
import { ProductoAgregarComponent } from './pages/ventas/pos/components/producto-agregar/producto-agregar.component';


@NgModule({
  declarations: [
    HomeComponent,
    DashboardComponent,
    //
    UsuarioComponent,
    RegistroUsuarioComponent,
    EditarUsuarioComponent,
    //
    CategoriaComponent,
    RegistroCategoriaComponent,
    EditarCategoriaComponent,
    //
    UnidadMedidaComponent,
    RegistroUnidadMedidaComponent,
    EditarUnidadMedidaComponent,
    //
    ProveedorComponent,
    RegistroProveedorComponent,
    EditarProveedorComponent,
    //
    ProductoComponent,
    RegistroProductoComponent,
    CargarProductoComponent,
    ClienteComponent,
    RegistroClienteComponent,
    EditarClienteComponent,
    TipoComprobanteComponent,
    DocumentoIdentidadComponent,
    RegistraTipoComprobanteComponent,
    EditarTipoComprobanteComponent,
    RegistrarDocumentoIdentidadComponent,
    EditarDocumentoIdentidadComponent,
    PosComponent,
    BoletaComponent,
    ProductPosVentaComponent,
    FormPosVentaComponent,
    ProductoAgregarComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    Select2Module
  ]
})
export class HomeModule { }
