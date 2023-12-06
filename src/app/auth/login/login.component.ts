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
    this.authService.login(us_user, us_password).subscribe({
      next: (response) => {
        const role = this.currentProfesional()?.us_role.toLowerCase();
        this.router.navigateByUrl(`/protected-route/${role}/pages/home`);
      },
      error: (error) => {
        Report.failure('No autorizado', error.message, 'Regresar');
      },
    });
  }
}
