import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EstacionTrabajo, polState } from '../prointerfaces/api.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class PolivalenteService {
  //variables de entorno
  private readonly apiUrl: string = environment.apiUrl;
  private apiUrlPolivalente: string = `${this.apiUrl}/workstation/`;

  constructor(private http: HttpClient) {}

  addNewPolivalenteInApi(pol: EstacionTrabajo): Observable<EstacionTrabajo> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPolivalente}create/`;
    return this.http.post<EstacionTrabajo>(url, pol, {
      headers,
    });
  }

  searchPolInApi(termino: string): Observable<EstacionTrabajo> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPolivalente}search/${termino}`;
    return this.http.get<EstacionTrabajo>(url, { headers });
  }

  searchAllPolInApi(): Observable<EstacionTrabajo[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPolivalente}list/`;
    return this.http.get<EstacionTrabajo[]>(url, { headers });
  }

  searchPolBySectionInAPi(
    termino: string
  ): Observable<EstacionTrabajo[] | null> {
    if (!termino) {
      return of(null);
    }

    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPolivalente}searchBySection/${termino}`;

    return this.http.get<EstacionTrabajo[]>(url, { headers });
  }

  updatePolivalenteStateInApi(
    term: string,
    pol: polState
  ): Observable<EstacionTrabajo> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlPolivalente}update/${term}`;
    return this.http.patch<EstacionTrabajo>(updateUrlInfo, pol, {
      headers,
    });
  }
}
