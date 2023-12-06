import { AuthService } from 'src/app/auth/services/auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-agr-home',
  templateUrl: './agr-home.component.html',
  styleUrls: ['./agr-home.component.css'],
})
export class AgrHomeComponent {
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
