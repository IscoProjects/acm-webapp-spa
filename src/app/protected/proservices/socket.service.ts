import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService extends Socket {
  constructor(private readonly authService: AuthService) {
    const currentUser = authService.currentUser();
    super({
      url: 'http://localhost:3000',
      options: {
        extraHeaders: {
          authentication: currentUser?.token!,
        },
      },
    });
  }
}
