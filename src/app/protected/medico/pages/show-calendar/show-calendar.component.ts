import { Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import { Loading, Report } from 'notiflix';
import {
  Agendamiento,
  EventosCalendar,
  Usuario,
} from 'src/app/protected/prointerfaces/api.interface';
import { AgendamientoService } from 'src/app/protected/proservices/agendamiento.service';
import dayGridPlugin from '@fullcalendar/daygrid';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';
import list from '@fullcalendar/list';

@Component({
  selector: 'app-show-calendar',
  templateUrl: './show-calendar.component.html',
  styleUrls: ['./show-calendar.component.css'],
})
export class ShowCalendarComponent {
  get currentProfesional() {
    return this.authService.currentUser();
  }

  eventos: EventosCalendar[] = [];
  calendarOptions!: CalendarOptions;
  user_info: Usuario = Object.create([]);

  constructor(
    private agendaService: AgendamientoService,
    private authService: AuthService,
    private userService: UsuarioService
  ) {}

  ngOnInit(): void {
    Loading.standard('Obteniendo información');
    this.userService.searchUserInfoInApi(this.currentProfesional!.id_usuario).subscribe({
      next: (resp) => {
        this.user_info = resp;
        this.agendaService
          .searchEventsByProfessionalInApi(this.user_info.id_usuario)
          .subscribe({
            next: (response) => {
              console.log(response);
              this.eventos = response;
              Loading.remove();
            },
            error: (e) => {
              console.log(e);
              this.eventos = [];
              Loading.remove();
            },
          });
      },
      error: (e) => {
        this.user_info = Object.create([]);
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
      // eventClick: this.handleEventClick.bind(this),
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
      weekends: false,
    };
  }

  // handleEventClick(arg: any) {
  //   let message = `Paciente: ${arg.event.title}.
  //   Fecha de consulta: ${arg.event.start.toLocaleString()}.
  //   Consultorio: ${arg.event.extendedProps.description}.`;

  //   Report.info('Detalles de agendamiento', message, 'Volver', {
  //     svgSize: '50px',
  //   });
  // }
}
