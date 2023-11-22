import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'acm-project-webapp';

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
      // case AuthStatus.authenticated:
      //   switch (this.currentProfesional()?.us_role) {
      //     case 'Administrador':
      //       this.router.navigateByUrl('/protected-route/admin/pages/home');
      //       break;

      //     case 'Agendador':
      //       this.router.navigateByUrl('/protected-route/agendador/pages/home');
      //       break;

      //     case 'Medico':
      //       this.router.navigateByUrl('/protected-route/medico/pages/home');
      //       break;

      //     default:
      //       this.router.navigateByUrl('/auth/error');
      //       break;
      //   }
      //   return;
      case AuthStatus.nonAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }
  });
}
