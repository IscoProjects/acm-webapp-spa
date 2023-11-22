import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgrHomeComponent } from './layout/agr-home/agr-home.component';
import { PageNotFoundComponent } from '../../auth/page-not-found/page-not-found.component';
import { CreateAgendamientoComponent } from './pages/create-agendamiento/create-agendamiento.component';
import { UpdateAgendamientoComponent } from './pages/update-agendamiento/update-agendamiento.component';
import { ShowPacienteComponent } from './pages/show-paciente/show-paciente.component';
import { UpdatePacienteComponent } from './pages/update-paciente/update-paciente.component';
import { CreatePacienteComponent } from './pages/create-paciente/create-paciente.component';
import { AgendadorProfileComponent } from './pages/agendador-profile/agendador-profile.component';
import { AgrCalendarComponent } from './pages/agr-calendar/agr-calendar.component';


const routes: Routes = [
  {
    path: 'pages',
    component: AgrHomeComponent,
    children: [
      {
        path: 'home',
        component: CreateAgendamientoComponent,
      },
      {
        path: 'agr-calendar',
        component: AgrCalendarComponent,
      },
      {
        path: 'update-agenda',
        component: UpdateAgendamientoComponent,
      },
      {
        path: 'register-patient',
        component: CreatePacienteComponent,
      },
      {
        path: 'show-patient',
        component: ShowPacienteComponent,
      },
      {
        path: 'update-patient',
        component: UpdatePacienteComponent,
      },
      {
        path: 'agr-profile',
        component: AgendadorProfileComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgendadorRoutingModule {}
