import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedHomeComponent } from './layout/med-home/med-home.component';
import { PageNotFoundComponent } from '../../auth/page-not-found/page-not-found.component';
import { ShowAppointmentComponent } from './pages/show-appointment/show-appointment.component';
import { SearchPatientComponent } from './pages/search-patient/search-patient.component';
import { ShowCalendarComponent } from './pages/show-calendar/show-calendar.component';
import { MedicoProfileComponent } from './pages/medico-profile/medico-profile.component';

const routes: Routes = [
  {
    path: 'pages',
    component: MedHomeComponent,
    children: [
      {
        path: 'home',
        component: ShowAppointmentComponent,
      },
      {
        path: 'search-patient',
        component: SearchPatientComponent,
      },
      {
        path: 'calendar',
        component: ShowCalendarComponent,
      },
      {
        path: 'med-profile',
        component: MedicoProfileComponent,
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
export class MedicoRoutingModule {}
