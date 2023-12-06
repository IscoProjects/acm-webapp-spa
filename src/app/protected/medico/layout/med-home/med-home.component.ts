import { Component } from '@angular/core';
import { AuthService } from '../../../../auth/services/auth.service';
import { SocketService } from '../../../proservices/socket.service';

@Component({
  selector: 'app-med-home',
  templateUrl: './med-home.component.html',
  styleUrls: ['./med-home.component.css'],
})
export class MedHomeComponent {
  // variables
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

  constructor(
    private authService: AuthService,
    private socketService: SocketService
  ) {}

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  userLogout() {
    this.authService.logout();
    this.socketService.disconnect();
  }
}
