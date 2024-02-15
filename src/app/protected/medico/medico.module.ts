import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicoRoutingModule } from './medico-routing.module';
import { MedHomeComponent } from './layout/med-home/med-home.component';
import { ShowAppointmentComponent } from './pages/show-appointment/show-appointment.component';
import { SearchPatientComponent } from './pages/search-patient/search-patient.component';
import { ShowCalendarComponent } from './pages/show-calendar/show-calendar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProtectedModule } from '../protected.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { MedicoProfileComponent } from './pages/medico-profile/medico-profile.component';
import { SharedProtectedModule } from '../shared/shared-protected.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    MedHomeComponent,
    ShowAppointmentComponent,
    SearchPatientComponent,
    ShowCalendarComponent,
    MedicoProfileComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MedicoRoutingModule,
    SharedProtectedModule,
    ReactiveFormsModule,
    ProtectedModule,
    FullCalendarModule,
    NgxPaginationModule,
    NgSelectModule
  ],
})
export class MedicoModule {}
