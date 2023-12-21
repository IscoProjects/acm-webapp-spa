import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isNonAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.authStatus() === AuthStatus.authenticated) {
    switch (authService.currentUser()?.us_role) {
      case 'Administrador':
        router.navigateByUrl('/protected-route/administrador/pages/home');
        break;

      case 'Agendador':
        router.navigateByUrl('/protected-route/agendador/pages/home');
        break;

      case 'Medico':
        router.navigateByUrl('/protected-route/medico/pages/home');
        break;

      default:
        router.navigateByUrl('/auth/error');
        break;
    }
    return false;
  }

  return true;
};
