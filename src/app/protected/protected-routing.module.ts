import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../auth/page-not-found/page-not-found.component';
import { roleGuard } from '../auth/guards/role.guard';

const routes: Routes = [
  {
    path: 'administrador',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canMatch: [roleGuard],
    data: { expectedRole: 'Administrador' },
  },
  {
    path: 'agendador',
    loadChildren: () =>
      import('./agendador/agendador.module').then((m) => m.AgendadorModule),
    canMatch: [roleGuard],
    data: { expectedRole: 'Agendador' },
  },
  {
    path: 'medico',
    loadChildren: () =>
      import('./medico/medico.module').then((m) => m.MedicoModule),
    canMatch: [roleGuard],
    data: { expectedRole: 'Medico' },
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
