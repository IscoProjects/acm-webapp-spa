import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import list from '@fullcalendar/list';
import { Loading, Report } from 'notiflix';
import {
  EstacionTrabajo,
  EventosCalendar,
  Usuario,
} from 'src/app/protected/prointerfaces/api.interface';
import { AgendamientoService } from 'src/app/protected/proservices/agendamiento.service';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  //Find data
  userFilterValue: string = '';
  usersInformation: Usuario[] = [];

  //FullCalendar
  calendarOptions!: CalendarOptions;
  eventos: EventosCalendar[] = [];

  constructor(
    private agendaService: AgendamientoService,
    private userService: UsuarioService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInformation();
  }

  private loadInformation() {
    Loading.pulse('Obteniendo información');
    this.userService.searchAllUsersInfoInApi().subscribe({
      next: (users) => {
        this.usersInformation = users;
        Loading.remove();
      },
      error: (e) => {
        this.usersInformation = [];
        Loading.remove();
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });

    this.calendarOptions = {
      plugins: [list],
      timeZone: 'local',
      views: {
        listDay: { buttonText: 'Diario' },
        listWeek: { buttonText: 'Semanal' },
        listMonth: { buttonText: 'Mes' },
      },
      buttonText: {
        today: 'Hoy',
      },
      initialView: 'listDay',
      validRange: {
        start: '2023-01-01',
      },
      businessHours: {
        startTime: '08:00:00',
        endTime: '17:00:00',
      },
      headerToolbar: {
        left: 'listDay,listWeek',
        center: 'title',
        right: 'prev,today,next',
      },
      locale: 'es',
      fixedWeekCount: false,
      firstDay: 1,
      weekends: true,
      datesSet: (info) => {
        const startDate = info.start.toISOString().split('T')[0];
        const endDate = info.end.toISOString().split('T')[0];
        this.getEventsFromApi(startDate, endDate, this.userFilterValue);
      },
    };
  }

  getEventsFromApi(startDate: string, endDate: string, user: string) {
    const searchMethod =
      user === ''
        ? this.agendaService.searchEventsByDatesInApi(startDate, endDate)
        : this.agendaService.searchEventsByProfessionalAndDatesInApi(
            user,
            startDate,
            endDate
          );

    searchMethod.subscribe((resp) => {
      this.eventos = resp;
      this.cdRef.detectChanges();
    });
  }

  onChangeSelection() {
    this.loadInformation();
  }
}
