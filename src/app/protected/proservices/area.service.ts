import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Area, areaState } from '../prointerfaces/api.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  //variables de entorno
  private readonly baseUrl: string = environment.baseUrl;
  private apiUrlArea: string = `${this.baseUrl}/area/`;

  constructor(private http: HttpClient) {}

  addNewAreaInApi(area: Area): Observable<Area> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlArea}create/`;
    return this.http.post<Area>(url, area, {
      headers,
    });
  }

  searchAreasMetadataInApi(): Observable<Area[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlArea}metadata/`;
    return this.http.get<Area[]>(url, { headers });
  }

  searchAllAreasInApi(): Observable<Area[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlArea}list/`;
    return this.http.get<Area[]>(url, { headers });
  }

  searchAreaInApi(termino: string): Observable<Area> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlArea}search/${termino}`;
    return this.http.get<Area>(url, { headers });
  }

  updateAreaStateInApi(term: string, area: areaState): Observable<Area> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlArea}update/${term}`;
    return this.http.patch<Area>(updateUrlInfo, area, {
      headers,
    });
  }
}
