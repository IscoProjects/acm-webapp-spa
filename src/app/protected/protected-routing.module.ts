import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../auth/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: 'agendador',
    loadChildren: () =>
      import('./agendador/agendador.module').then((m) => m.AgendadorModule),
  },
  {
    path: 'medico',
    loadChildren: () =>
      import('./medico/medico.module').then((m) => m.MedicoModule),
  },
  {
    path: '',
    component: PageNotFoundComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtectedRoutingModule {}
