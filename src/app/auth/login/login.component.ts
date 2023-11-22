import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Report } from 'notiflix';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  myLoginForm: FormGroup = this.fb.group({
    us_user: ['', [Validators.required, Validators.minLength(6)]],
    us_password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get currentProfesional() {
    return this.authService.currentUser;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  login() {
    const { us_user, us_password } = this.myLoginForm.value;
    console.log(us_password, us_user);

    this.authService.login(us_user, us_password).subscribe({
      next: (response) => {
        console.log(response);
        console.log(this.currentProfesional()?.us_user);
        switch (this.currentProfesional()?.us_role) {
          case 'Administrador':
            this.router.navigateByUrl('/protected-route/admin/pages/home');
            break;

          case 'Agendador':
            this.router.navigateByUrl('/protected-route/agendador/pages/home');
            break;

          case 'Medico':
            this.router.navigateByUrl('/protected-route/medico/pages/home');
            break;

          default:
            this.router.navigateByUrl('/auth/error');
            break;
        }
      },
      error: (error) => {
        Report.failure('Unauthorized', error, 'Regresar');
      },
    });
  }
}
