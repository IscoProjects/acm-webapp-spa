import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicoRoutingModule } from './medico-routing.module';
import { MedHomeComponent } from './layout/med-home/med-home.component';
import { SharedProtectedModule } from '../shared-protected/shared-protected.module';
import { ShowAppointmentComponent } from './pages/show-appointment/show-appointment.component';
import { SearchPatientComponent } from './pages/search-patient/search-patient.component';
import { ShowCalendarComponent } from './pages/show-calendar/show-calendar.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProtectedModule } from '../protected.module';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { MedicoProfileComponent } from './pages/medico-profile/medico-profile.component';
import { SlopeTableComponent } from './components/slope-table/slope-table.component';
import { AttendanceTableComponent } from './components/attendance-table/attendance-table.component';
import { AbsenceTableComponent } from './components/absence-table/absence-table.component';
import { SummaryTableComponent } from './components/summary-table/summary-table.component';

@NgModule({
  declarations: [
    MedHomeComponent,
    ShowAppointmentComponent,
    SearchPatientComponent,
    ShowCalendarComponent,
    MedicoProfileComponent,
    SlopeTableComponent,
    AttendanceTableComponent,
    AbsenceTableComponent,
    SummaryTableComponent,
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
  ],
})
export class MedicoModule {}
