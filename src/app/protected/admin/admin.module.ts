import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdmHomeComponent } from './layout/adm-home/adm-home.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProtectedModule } from '../protected.module';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { AreaDistributionComponent } from './pages/area-distribution/area-distribution.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AdminCalendarComponent } from './pages/admin-calendar/admin-calendar.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedProtectedModule } from '../shared/shared-protected.module';

@NgModule({
    declarations: [
        DashboardComponent,
        AdmHomeComponent,
        AdminProfileComponent,
        ManageUserComponent,
        AssignmentsComponent,
        AreaDistributionComponent,
        AdminCalendarComponent,
    ],
    exports: [],
    imports: [
        CommonModule,
        AdminRoutingModule,
        FormsModule,
        ProtectedModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        FullCalendarModule,
        SharedProtectedModule,
        NgSelectModule
    ]
})
export class AdminModule {}
