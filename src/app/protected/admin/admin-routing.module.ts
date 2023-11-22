import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PageNotFoundComponent } from '../../auth/page-not-found/page-not-found.component';
import { AdminProfileComponent } from './pages/admin-profile/admin-profile.component';
import { ManageUserComponent } from './pages/manage-user/manage-user.component';
import { AssignmentsComponent } from './pages/assignments/assignments.component';
import { AreaDistributionComponent } from './pages/area-distribution/area-distribution.component';
import { AdmHomeComponent } from './layout/adm-home/adm-home.component';
import { AdminCalendarComponent } from './pages/admin-calendar/admin-calendar.component';

const routes: Routes = [
  {
    path: 'pages',
    component: AdmHomeComponent,
    children: [
      {
        path: 'home',
        component: DashboardComponent,
      },
      {
        path: 'assignments',
        component: AssignmentsComponent,
      },
      {
        path: 'area-distribution',
        component: AreaDistributionComponent,
      },
      {
        path: 'adm-calendar',
        component: AdminCalendarComponent,
      },
      {
        path: 'manage-user',
        component: ManageUserComponent,
      },
      {
        path: 'admin-profile',
        component: AdminProfileComponent,
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
export class AdminRoutingModule {}
