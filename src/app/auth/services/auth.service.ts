import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import {
  User,
  LoginResponse,
  CheckTokenResponse,
} from '../interfaces/auth.interface';
import { environment } from 'src/environments/environments';
import { AuthStatus } from '../interfaces/auth-status.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //variables de entorno
  private readonly apiUrl: string = environment.apiUrl;

  //Signals
  private _currentUser = signal<User | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  //metodos publicos
  public currentUser = computed(() => this._currentUser());
  public authStatus = computed(() => this._authStatus());

  constructor(private http: HttpClient) {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: User, token: string): boolean {
    user.token = token;
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);

    return true;
  }

  login(us_user: string, us_password: string): Observable<boolean> {
    const url = `${this.apiUrl}/professional/login`;
    const body_query = { us_user, us_password };

    return this.http.post<LoginResponse>(url, body_query).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError((err) => {
        if (err.status === 0) {
          return throwError(
            () =>
              new Error(
                'No se pudo establecer conexión con el servidor. Por favor, inténtalo de nuevo más tarde.'
              )
          );
        } else {
          return throwError(() => new Error(err.error.message));
        }
      })
    );
  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${this.apiUrl}/professional/status-verify`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    if (!this.isTokenValid(token)) {
      this.logout();
      return of(false);
    }

    const bearerToken = `Bearer ${token}`;
    const headers = new HttpHeaders().set('Authorization', bearerToken);
    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(user, token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.nonAuthenticated);
        return of(false);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set(AuthStatus.nonAuthenticated);
  }

  isTokenValid(token: string): boolean {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return tokenData.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
}

