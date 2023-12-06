import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SocketService extends Socket {
  constructor(private readonly authService: AuthService) {
    const currentUser = authService.currentUser();
    super({
      url: environment.apiUrl,
      options: {
        extraHeaders: {
          authentication: currentUser?.token!,
        },
      },
    });
  }
}
