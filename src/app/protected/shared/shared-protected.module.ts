import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ProtectedModule } from '../protected.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { NoDataComponent } from './components/no-data/no-data.component';

@NgModule({
  declarations: [UserProfileComponent, CalendarComponent, NoDataComponent],
  exports: [UserProfileComponent, CalendarComponent, NoDataComponent],
  imports: [
    CommonModule,
    RouterModule,
    ProtectedModule,
    ReactiveFormsModule,
    FormsModule,
    FullCalendarModule,
  ],
})
export class SharedProtectedModule {}
