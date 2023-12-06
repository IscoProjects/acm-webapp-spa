import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const loadModuleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.checkAuthStatus()) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false;
};
