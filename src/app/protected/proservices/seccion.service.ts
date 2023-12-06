import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  AvgTiempoEsperaPorSeccion,
  Seccion,
  seccionState,
} from '../prointerfaces/api.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class SeccionService {
  //variables de entorno
  private readonly apiUrl: string = environment.apiUrl;
  private apiUrlSeccion: string = `${this.apiUrl}/section/`;

  constructor(private http: HttpClient) {}

  addNewSeccionInApi(seccion: Seccion): Observable<Seccion> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlSeccion}create/`;
    return this.http.post<Seccion>(url, seccion, {
      headers,
    });
  }

  searchAllSectionInApi(): Observable<Seccion[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlSeccion}list/`;
    return this.http.get<Seccion[]>(url, { headers });
  }

  searchSectionInApi(termino: string): Observable<Seccion | null> {
    if (!termino) {
      return of(null);
    }
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlSeccion}search/${termino}`;
    return this.http.get<Seccion>(url, { headers });
  }

  searchSectionByAreaInApi(termino: string): Observable<Seccion[] | null> {
    if (!termino) {
      return of(null);
    }
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlSeccion}searchByArea/${termino}`;
    return this.http.get<Seccion[]>(url, { headers });
  }

  getAvgWaitingTimeBySection(
    days: number
  ): Observable<AvgTiempoEsperaPorSeccion[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlSeccion}avgWaitingTime/${days}`;

    return this.http.get<AvgTiempoEsperaPorSeccion[]>(url, { headers });
  }

  updateSeccionStateInApi(
    term: string,
    Seccion: seccionState
  ): Observable<Seccion> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlSeccion}update/${term}`;
    return this.http.patch<Seccion>(updateUrlInfo, Seccion, {
      headers,
    });
  }
}
