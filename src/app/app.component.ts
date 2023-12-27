import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  get currentProfesional() {
    return this.authService.currentUser;
  }

  private authService = inject(AuthService);
  private router = inject(Router);

  public finishedAuthStatus = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }

    return true;
  });

  public authStatusChange = effect(() => {
    switch (this.authService.authStatus()) {
      case AuthStatus.checking:
        return;
      case AuthStatus.nonAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });
}
