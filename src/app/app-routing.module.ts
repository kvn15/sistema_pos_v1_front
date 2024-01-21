import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';

const routes: Routes = [
  {
    //Ruta inicial
    path: '',
    loadChildren: () => import("./home/home.module").then( m => m.HomeModule ),
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule )
  },
  {
    // Cuando no haya ruta redirigeme a la principal
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    // Si no exista una ruta mandame al 404
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
