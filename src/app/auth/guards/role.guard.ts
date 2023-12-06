import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRole = route.data && route.data['expectedRole'];
  const currentRole = authService.currentUser()?.us_role;

  if (currentRole !== expectedRole) {
    return router.parseUrl(router.url);
  }

  return true;
};
