import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsuarioComponent } from './pages/Administracion/usuario/usuario.component';
import { SystemGuard } from '../config/guard/system.guard';
import { CategoriaComponent } from './pages/almacen/categoria/categoria.component';
import { UnidadMedidaComponent } from './pages/almacen/unidad-medida/unidad-medida.component';
import { ProveedorComponent } from './pages/almacen/proveedor/proveedor.component';
import { ProductoComponent } from './pages/almacen/producto/producto.component';
import { RegistroProductoComponent } from './pages/almacen/producto/components/registro-producto/registro-producto.component';
import { CargarProductoComponent } from './pages/almacen/producto/components/cargar-producto/cargar-producto.component';
import { ClienteComponent } from './pages/Administracion/cliente/cliente.component';
import { TipoComprobanteComponent } from './pages/sunat/tipo-comprobante/tipo-comprobante.component';
import { DocumentoIdentidadComponent } from './pages/sunat/documento-identidad/documento-identidad.component';
import { PosComponent } from './pages/ventas/pos/pos.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'dashboard',
        // title: 'Dashboards',
        // canActivate: [SystemGuard],
        component: DashboardComponent
      },
      {
        path: 'almacen/categoria',
        component: CategoriaComponent,
        title: 'Categoria',
        canActivate: [SystemGuard],
      },
      {
        path: 'almacen/unidad-medida',
        component: UnidadMedidaComponent,
        title: 'Unidad Medida',
        canActivate: [SystemGuard],
      },
      {
        path: 'compras',
        title: 'Compras',
        canActivate: [SystemGuard],
        children: [
          {
            path: 'proveedor',
            component: ProveedorComponent
          }
        ]
      },
      {
        path: 'articulos',
        title: 'Artículos',
        canActivate: [SystemGuard],
        children: [
          {
            path: 'productos',
            component: ProductoComponent
          },
          {
            path: 'registro-producto',
            component: RegistroProductoComponent
          },
          {
            path: 'editar-producto/:id',
            component: RegistroProductoComponent
          },
          {
            path: 'cargar-producto',
            component: CargarProductoComponent
          }
        ]
      },
      {
        path: 'venta/pos',
        title: 'POS',
        component: PosComponent
      },
      {
        path: 'administracion',
        title: 'Administración',
        canActivate: [SystemGuard],
        children: [
          {
            path: 'usuarios',
            component: UsuarioComponent
          },
          {
            path: 'clientes',
            component: ClienteComponent
          }
        ]
      },
      {
        path: 'sunat',
        title: 'Configuración Sunat',
        canActivate: [SystemGuard],
        children: [
          {
            path: 'tipo-comprobante',
            component: TipoComprobanteComponent
          },
          {
            path: 'tipo-documento',
            component: DocumentoIdentidadComponent
          }
        ]
      },
      {
        // Cuando no haya ruta redirigeme a la principal
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
