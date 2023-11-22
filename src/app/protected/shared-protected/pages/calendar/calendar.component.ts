import { ChangeDetectorRef, Component } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import list from '@fullcalendar/list';
import { Loading, Report } from 'notiflix';
import {
  EstacionTrabajo,
  EventosCalendar,
} from 'src/app/protected/prointerfaces/api.interface';
import { AgendamientoService } from 'src/app/protected/proservices/agendamiento.service';
import { PolivalenteService } from 'src/app/protected/proservices/polivalente.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  //Find data
  polFilterValue: string = '';
  polsInformation: EstacionTrabajo[] = [];

  //FullCalendar
  calendarOptions!: CalendarOptions;
  eventos: EventosCalendar[] = [];

  constructor(
    private agendaService: AgendamientoService,
    private polService: PolivalenteService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInformation();
  }

  private loadInformation() {
    Loading.pulse('Obteniendo información');
    this.polService.searchAllPolInApi().subscribe({
      next: (pols) => {
        console.log(pols);
        this.polsInformation = pols;
        Loading.remove();
      },
      error: (e) => {
        this.polsInformation = [];
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
      weekends: false,
      datesSet: (info) => {
        const startDate = info.start.toISOString().split('T')[0];
        const endDate = info.end.toISOString().split('T')[0];
        this.getEventsFromApi(startDate, endDate, this.polFilterValue);
      },
    };
  }

  getEventsFromApi(startDate: string, endDate: string, pol: string) {
    const searchMethod =
      pol === ''
        ? this.agendaService.searchEventsByDatesInApi(startDate, endDate)
        : this.agendaService.searchEventsByWorkstationAndDatesInApi(
            pol,
            startDate,
            endDate
          );

    searchMethod.subscribe((resp) => {
      console.log(resp);
      this.eventos = resp;
      this.cdRef.detectChanges();
    });
  }

  onChangeSelection() {
    this.loadInformation();
  }
}
