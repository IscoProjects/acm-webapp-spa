import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './auth/page-not-found/page-not-found.component';
import { isNonAuthenticatedGuard } from './auth/guards/is-non-authenticated.guard';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { loadModuleGuard } from './auth/guards/load-module.guard';

const routes: Routes = [
  {
    path: 'auth',
    canActivate: [isNonAuthenticatedGuard],
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'protected-route',
    canActivate: [isAuthenticatedGuard],
    canMatch: [loadModuleGuard],
    loadChildren: () =>
      import('./protected/protected.module').then((m) => m.ProtectedModule),
  },
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
