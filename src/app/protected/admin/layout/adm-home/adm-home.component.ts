import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-adm-home',
  templateUrl: './adm-home.component.html',
  styleUrls: ['./adm-home.component.css'],
})
export class AdmHomeComponent {

  showSidebar: boolean = false;
  toggleDarkMode = document.documentElement.className.includes('dark');

  get currentProfesional() {
    return this.authService.currentUser();
  }

  changeDarkMode() {
    this.toggleDarkMode = document.documentElement.classList.toggle('dark');
    this.toggleDarkMode
      ? (localStorage['theme'] = 'dark')
      : (localStorage['theme'] = 'light');
  }

  constructor(private authService: AuthService) {}

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  userLogout() {
    this.authService.logout();
  }
}
