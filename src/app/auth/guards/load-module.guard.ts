import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { tap } from 'rxjs';

export const loadModuleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('Load guard', route, segments);

  console.log(typeof authService.checkAuthStatus());

  if (authService.checkAuthStatus()) {
    return true;
  }

  router.navigateByUrl('/auth/login');
  return false;
};
