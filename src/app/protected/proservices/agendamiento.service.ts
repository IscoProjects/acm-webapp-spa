import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  Agendamiento,
  AvgTiempoEspera,
  Eventos,
  EventosCalendar,
} from '../prointerfaces/api.interface';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AgendamientoService {
  //variables de entorno
  private readonly apiUrl: string = environment.apiUrl;
  private apiUrlAgenda: string = `${this.apiUrl}/scheduling/`;

  constructor(private http: HttpClient) {}

  addNewSchedulingInApi(agenda: Agendamiento): Observable<Agendamiento> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}create/`;
    return this.http.post<Agendamiento>(url, agenda, {
      headers,
    });
  }

  searchEventsInApi(): Observable<EventosCalendar[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}list/`;

    return this.http.get<Agendamiento[]>(url, { headers }).pipe(
      map((response) => {
        return response.map((item) => ({
          title: this.createEventTitle(item),
          start: this.createStartDate(item.fecha_consulta, item.hora_consulta),
          end: this.createEndDate(
            item.fecha_consulta,
            item.hora_consulta,
            item.duracion_consulta
          ),
          allDay: false,
        }));
      })
    );
  }

  searchEventsByDatesInApi(
    startDate: string,
    endDate: string
  ): Observable<EventosCalendar[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}searchByDates/${startDate}/${endDate}/`;

    return this.http.get<Agendamiento[]>(url, { headers }).pipe(
      map((response) => {
        return response.map((item) => ({
          title: this.createEventTitle(item),
          start: this.createStartDate(item.fecha_consulta, item.hora_consulta),
          end: this.createEndDate(
            item.fecha_consulta,
            item.hora_consulta,
            item.duracion_consulta
          ),
          allDay: false,
        }));
      })
    );
  }

  searchAgendaByProfessionalAndDateInApi(
    termino: string,
    fecha: string
  ): Observable<Agendamiento[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}searchByProfessional&Date/${termino}/${fecha}`;

    return this.http.get<Agendamiento[]>(url, { headers });
  }

  searchEventsByProfessionalInApi(term: string): Observable<EventosCalendar[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}searchByProfessional/${term}`;

    return this.http.get<Agendamiento[]>(url, { headers }).pipe(
      map((response) => {
        return response.map((item) => ({
          title: this.createEventTitle(item),
          start: this.createStartDate(item.fecha_consulta, item.hora_consulta),
          end: this.createEndDate(
            item.fecha_consulta,
            item.hora_consulta,
            item.duracion_consulta
          ),
          allDay: false,
        }));
      })
    );
  }

  searchEventsByProfessionalAndDateInApi(
    term: string,
    date: string
  ): Observable<Eventos[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}searchByProfessional&Date/${term}/${date}`;

    return this.http.get<Agendamiento[]>(url, { headers }).pipe(
      map((response) => {
        return response.map((item) => ({
          paciente: `${item.paciente!.pac_apellido} ${
            item.paciente!.pac_nombre
          }`,
          start: item.hora_consulta,
          end: this.createEndTime(
            item.fecha_consulta,
            item.hora_consulta,
            item.duracion_consulta
          ),
          duracion_consulta: item.duracion_consulta,
        }));
      })
    );
  }

  searchEventsByProfessionalAndDatesInApi(
    term: string,
    startDate: string,
    endDate: string
  ): Observable<EventosCalendar[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}searchByProfessional&Dates/${term}/${startDate}/${endDate}`;

    return this.http.get<Agendamiento[]>(url, { headers }).pipe(
      map((response) => {
        return response.map((item) => ({
          title: this.createEventTitle(item),
          start: this.createStartDate(item.fecha_consulta, item.hora_consulta),
          end: this.createEndDate(
            item.fecha_consulta,
            item.hora_consulta,
            item.duracion_consulta
          ),
          allDay: false,
        }));
      })
    );
  }

  getAvgWaitingTime(days: number): Observable<AvgTiempoEspera[]> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const url = `${this.apiUrlAgenda}avgWaitingTime/${days}`;

    return this.http.get<AvgTiempoEspera[]>(url, { headers });
  }

  updateSchedulingInApi(
    term: string,
    agenda: Agendamiento
  ): Observable<Agendamiento> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlAgenda}update/${term}`;
    return this.http.patch<Agendamiento>(updateUrlInfo, agenda, {
      headers,
    });
  }

  updateSchedulingStateInApi(
    term: string,
    mark: any
  ): Observable<Agendamiento> {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlAgenda}update/${term}`;
    return this.http.patch<Agendamiento>(updateUrlInfo, mark, {
      headers,
    });
  }

  cancelSchedulingInApi(term: string, status: any) {
    const x_token = `Bearer ${localStorage.getItem('token')}`;
    const headers = new HttpHeaders().set('Authorization', x_token || '');
    const updateUrlInfo = `${this.apiUrlAgenda}update/${term}`;
    return this.http.patch(updateUrlInfo, status, {
      headers,
    });
  }

  private createEventTitle(item: Agendamiento): string {
    const asistencia = item.pac_asistencia ? 'Asistido' : 'No Asistido';
    const vigencia = item.estado_agenda ? 'Vigente' : 'No Vigente';
    const observaciones = item.observaciones || 'S/Inf.';
    const detalle = item.detalle_agenda || 'S/Inf';

    return `PAC.: ${item.paciente!.pac_cedula}, ${
      item.paciente!.pac_apellido
    } ${item.paciente!.pac_nombre}. PROF.: ${item.usuario?.us_apellidos} ${
      item.usuario?.us_nombres
    }. ESTADO: ${vigencia}. DETALLES: ${detalle} - ${asistencia}. OBS.: ${observaciones}`;
  }

  private createStartDate(fecha: string, hora: string): Date {
    return new Date(`${fecha}T${hora}`);
  }

  private createEndDate(fecha: string, hora: string, duracion: number): Date {
    const startDate = this.createStartDate(fecha, hora);
    return new Date(startDate.getTime() + duracion * 60000);
  }

  private createEndTime(fecha: string, hora: string, duracion: number): string {
    const startDate = this.createStartDate(fecha, hora);
    const endTime = new Date(startDate.getTime() + duracion * 60000);
    const hours = endTime.getHours().toString().padStart(2, '0');
    const minutes = endTime.getMinutes().toString().padStart(2, '0');
    const seconds = endTime.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}
