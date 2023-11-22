import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { Observable, tap, map } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TokenVerifyGuard {
  constructor(private authService: AuthService, private router: Router) {}

  // canActivate(): Observable<boolean> | boolean {
  //   return this.authService.tokenValidation().pipe(
  //     tap((valid) => {
  //       if (!valid) {
  //         this.router.navigateByUrl('auth');
  //       }
  //     })
  //   );
  // }

  // canLoad(): Observable<boolean> | boolean {
  //   return this.authService.tokenValidation().pipe(
  //     tap((valid) => {
  //       if (!valid) {
  //         this.router.navigateByUrl('auth');
  //       }
  //     })
  //   );
  // }
}
