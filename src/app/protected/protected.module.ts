import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProtectedRoutingModule } from './protected-routing.module';
import { NullPipe } from './pipes/null-pipe.pipe';
import { BirthdayPipe } from './pipes/birthday.pipe';
import { StatusManagementPipe } from './pipes/status-management.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { AssistanceStatusPipe } from './pipes/assistance-status.pipe';
import { FilterUserStringPipe } from './pipes/filter-user-string.pipe';
import { FilterPacienteStringPipe } from './pipes/filter-paciente-string.pipe';
import { FilterAreaStringPipe } from './pipes/filter-area-string.pipe';
import { FilterSeccionStringPipe } from './pipes/filter-seccion-string.pipe';
import { FilterPolivalenteStringPipe } from './pipes/filter-polivalente-string.pipe';
import { ConsultaStatusPipe } from './pipes/consulta-status.pipe';
import { NanToZeroPipe } from './pipes/nan-to-zero.pipe';
import { EmptyArrayPipe } from './pipes/empty-array.pipe';

@NgModule({
  declarations: [
    NullPipe,
    BirthdayPipe,
    StatusManagementPipe,
    AssistanceStatusPipe,
    FilterUserStringPipe,
    FilterPacienteStringPipe,
    FilterAreaStringPipe,
    FilterSeccionStringPipe,
    FilterPolivalenteStringPipe,
    ConsultaStatusPipe,
    NanToZeroPipe,
    EmptyArrayPipe,
  ],
  imports: [CommonModule, ProtectedRoutingModule, NgxPaginationModule],
  exports: [
    NullPipe,
    BirthdayPipe,
    StatusManagementPipe,
    AssistanceStatusPipe,
    FilterPacienteStringPipe,
    FilterUserStringPipe,
    FilterAreaStringPipe,
    FilterSeccionStringPipe,
    FilterPolivalenteStringPipe,
    ConsultaStatusPipe,
    NanToZeroPipe,
    EmptyArrayPipe,
  ],
})
export class ProtectedModule {}
