import { ProtectedModule } from './../protected.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AgendadorRoutingModule } from './agendador-routing.module';
import { AgrHomeComponent } from './layout/agr-home/agr-home.component';
import { CreateAgendamientoComponent } from './pages/create-agendamiento/create-agendamiento.component';
import { UpdateAgendamientoComponent } from './pages/update-agendamiento/update-agendamiento.component';
import { CreatePacienteComponent } from './pages/create-paciente/create-paciente.component';
import { ShowPacienteComponent } from './pages/show-paciente/show-paciente.component';
import { UpdatePacienteComponent } from './pages/update-paciente/update-paciente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgendadorProfileComponent } from './pages/agendador-profile/agendador-profile.component';
import { SharedProtectedModule } from '../shared-protected/shared-protected.module';
import { AgrCalendarComponent } from './pages/agr-calendar/agr-calendar.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    AgrHomeComponent,
    CreateAgendamientoComponent,
    UpdateAgendamientoComponent,
    CreatePacienteComponent,
    ShowPacienteComponent,
    UpdatePacienteComponent,
    AgendadorProfileComponent,
    AgrCalendarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AgendadorRoutingModule,
    ReactiveFormsModule,
    FullCalendarModule,
    ProtectedModule,
    NgxPaginationModule,
    SharedProtectedModule,
    NgSelectModule,
  ],
})
export class AgendadorModule {}
