import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AvgTiempoEspera,
  UserAssignment,
  Usuario,
  userInformation,
  userState,
} from '../prointerfaces/api.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  //variables de entorno
  private readonly apiUrl: string = environment.apiUrl;
  private apiUrlUsuario: string = `${this.apiUrl}/professional/`;

  constructor(private http: HttpClient) {}

  addNewSeccionInApi(user: Usuario): Observable<Usuario> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlUsuario}create/`;
    return this.http.post<Usuario>(url, user, {
      headers,
    });
  }

  searchAllUsersInfoInApi(): Observable<Usuario[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlUsuario}list`;
    return this.http.get<Usuario[]>(url, { headers });
  }

  searchAllUsersMetadataFromApi(): Observable<Usuario[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlUsuario}metadata`;
    return this.http.get<Usuario[]>(url, { headers });
  }

  searchUsersBySectionFromApi(seccion: string): Observable<Usuario[] | null> {
    if (!seccion) {
      return of(null);
    }
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlUsuario}searchBySection/${seccion}`;
    return this.http.get<Usuario[]>(url, { headers });
  }

  searchUserInfoInApi(termino: string): Observable<Usuario> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlUsuario}search/${termino}`;
    return this.http.get<Usuario>(url, { headers });
  }

  verifyUserNickname(termino: string) {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlUsuario}user-verify/${termino}`;
    return this.http.get(url, { headers });
  }

  getAvgWaitingTimeByUser(term: string): Observable<AvgTiempoEspera[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlUsuario}avgWaitingTime/${term}`;

    return this.http.get<AvgTiempoEspera[]>(url, { headers });
  }

  updateUserInformationInApi(
    term: string,
    user: userInformation
  ): Observable<Usuario> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlUsuario}update/${term}`;
    return this.http.patch<Usuario>(updateUrlInfo, user, {
      headers,
    });
  }

  updateUserStateInApi(term: string, user: userState): Observable<Usuario> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlUsuario}update/${term}`;
    return this.http.patch<Usuario>(updateUrlInfo, user, {
      headers,
    });
  }

  updateUserPasswordInApi(term: string, password: any): Observable<Usuario> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlUsuario}update-password/${term}`;
    return this.http.patch<Usuario>(updateUrlInfo, password, {
      headers,
    });
  }

  updateUserAssignmentInApi(
    term: string,
    user: UserAssignment
  ): Observable<Usuario> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlUsuario}update/${term}`;
    return this.http.patch<Usuario>(updateUrlInfo, user, {
      headers,
    });
  }
}
