import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Paciente } from '../prointerfaces/api.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class PacienteService {
  //variables de entorno
  private readonly apiUrl: string = environment.apiUrl;
  private apiUrlPaciente: string = `${this.apiUrl}/patient/`;

  constructor(private http: HttpClient) {}

  addNewPatientInApi(paciente: Paciente): Observable<Paciente> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPaciente}create/`;
    return this.http.post<Paciente>(url, paciente, {
      headers,
    });
  }

  searchPatientInApi(termino: string): Observable<Paciente> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPaciente}search/${termino}`;
    return this.http.get<Paciente>(url, { headers });
  }

  searchPatientMetadataInApi(termino: string): Observable<Paciente> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPaciente}metadata/${termino}`;

    return this.http.get<Paciente>(url, { headers }).pipe(
      map((paciente) => {
        if (paciente.agendamiento && paciente.agendamiento.length > 0) {
          // Filtrar los agendamientos cuyo detalle_agenda sea distinto de "Demanda no agendada"
          paciente.agendamiento = paciente.agendamiento.filter(
            (agenda) => agenda.detalle_agenda !== 'Demanda no Agendada'
          );
        }
        return paciente;
      })
    );
  }

  searchAllPatientInApi(): Observable<Paciente[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlPaciente}list/`;
    return this.http.get<Paciente[]>(url, { headers });
  }

  updatePatientInApi(term: string, paciente: Paciente): Observable<Paciente> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlPaciente}update/${term}`;
    return this.http.patch<Paciente>(updateUrlInfo, paciente, {
      headers,
    });
  }
}
