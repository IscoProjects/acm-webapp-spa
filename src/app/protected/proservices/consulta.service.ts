import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Consulta } from '../prointerfaces/api.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ConsultaService {
  //variables de entorno
  private readonly baseUrl: string = environment.baseUrl;
  private apiUrlAgenda: string = `${this.baseUrl}/appointment/`;

  constructor(private http: HttpClient) {}

  setConsultationInformation(info: Consulta): Observable<Consulta> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}create/`;
    return this.http.post<Consulta>(url, info, {
      headers,
    });
  }
}
