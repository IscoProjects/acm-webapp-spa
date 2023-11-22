import { AuthService } from 'src/app/auth/services/auth.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agr-home',
  templateUrl: './agr-home.component.html',
  styleUrls: ['./agr-home.component.css'],
})
export class AgrHomeComponent {
  // variables
  showSidebar: boolean = false;
  toggleDarkMode = document.documentElement.className.includes('dark');

  get currentProfesional() {
    return this.authService.currentUser();
  }
  
  changeDarkMode() {
    this.toggleDarkMode = document.documentElement.classList.toggle('dark');
    console.log('Dark: ', this.toggleDarkMode);
    this.toggleDarkMode
      ? (localStorage['theme'] = 'dark')
      : (localStorage['theme'] = 'light');
  }

  constructor(private authService: AuthService, private router: Router) {}

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  userLogout() {
    this.authService.logout();
  }
}
