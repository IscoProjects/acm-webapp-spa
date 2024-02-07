import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Agendamiento,
  EstacionTrabajo,
  Eventos,
} from 'src/app/protected/prointerfaces/api.interface';
import { AgendamientoService } from '../../../proservices/agendamiento.service';
import { PacienteService } from '../../../proservices/paciente.service';
import { Paciente, Usuario } from '../../../prointerfaces/api.interface';
import { filter, switchMap, tap } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';
import { PolivalenteService } from 'src/app/protected/proservices/polivalente.service';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-update-agendamiento',
  templateUrl: './update-agendamiento.component.html',
  styleUrls: ['./update-agendamiento.component.css'],
})
export class UpdateAgendamientoComponent implements OnInit {
  get currentProfesional() {
    return this.authService.currentUser();
  }

  //Paginacion
  public filter: string = '';
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = false;
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 20,
    currentPage: 1,
  };
  public labels: any = {
    previousLabel: 'Anterior',
    nextLabel: 'Siguiente',
    screenReaderPaginationLabel: 'Pagination',
    screenReaderPageLabel: 'Pág.',
    screenReaderCurrentLabel: `Página nro.`,
  };
  public eventLog: string[] = [];

  //Variables
  patientInformation: Paciente = Object.create([]);
  showUpdateModal: boolean = false;
  idAgendamientoSelected: string = '';
  agendaUpdateSumary: string = '';
  patientNumerOfDates: number = 0;
  searchPatientString: string = '';
  getDateNow = new Date();
  isAgendaFound: boolean = false;
  listUsersBySection: Usuario[] = [];
  agendamientos: Agendamiento[] = [];

  //Eventos
  eventos: Eventos[] = [];
  formatedDateNow: string = this.getDateNow.toISOString().split('T')[0];
  formatedTimeNow: string = '';
  formatedTimeEnd: string = '';
  defaultAppointmentTime: number = 30;
  getProfessionalToUpdate: string = '';

  updateDateForm: FormGroup = this.fb.group({
    usuario: ['', [Validators.required]],
    fecha_consulta: ['', [Validators.required]],
    hora_consulta: ['', [Validators.required]],
    detalle_agenda: ['', [Validators.required]],
    duracion_consulta: ['', [Validators.required]],
  });

  cancelDateForm: FormGroup = this.fb.group({
    detalle_agenda: ['', [Validators.required]],
    estado_agenda: false,
  });

  userFilterValue: string = '';
  usersInformation: Usuario[] = [];

  constructor(
    private authService: AuthService,
    private agendaService: AgendamientoService,
    private pacienteService: PacienteService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.ngSelectConfig.appendTo = 'body';
  }

  ngOnInit(): void {
    Loading.pulse('Obteniendo información');
    this.usuarioService.searchAllUsersInfoInApi().subscribe({
      next: (users) => {
        this.usersInformation = users;
        this.userFilterValue = users[0].id_usuario;
        this.searchAgendaByProfessional();
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
  }

  searchAgendaByProfessional() {
    Loading.dots('Cargando...');
    this.agendaService
      .searchAgendaByProfessionalAndDateInApi(
        this.userFilterValue,
        this.formatedDateNow
      )
      .subscribe({
        next: (agenda) => {
          this.agendamientos = agenda;
          Loading.remove();
        },
        error: (e) => {
          this.agendamientos = [];
          Loading.remove();
          Report.failure(
            '¡Ups! Algo ha salido mal',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
  }

  updatePatientInformationForm(agenda: Agendamiento) {
    const getTimeNow = new Date();
    this.formatedTimeNow = this.formatTime(getTimeNow);
    this.formatedDateNow = this.getDateNow.toISOString().split('T')[0];
    this.idAgendamientoSelected = agenda.id_agendamiento;

    this.agendaUpdateSumary = `La consulta está programada para el ${agenda.fecha_consulta} a las ${agenda.hora_consulta}, con el Profesional ${agenda.usuario?.us_apellidos} ${agenda.usuario?.us_nombres}. Para cambiarla, seleccione una nueva fecha.`;
    this.updateDateForm.get('detalle_agenda')?.setValue('Reagendado');
    this.getProfessionalToUpdate = agenda.usuario!.id_usuario;
    this.updateDateForm.get('usuario')?.setValue(this.getProfessionalToUpdate);

    const seccion = agenda.usuario!.estacion_trabajo.seccion.descripcion;

    this.usuarioService.searchUsersBySectionFromApi(seccion).subscribe({
      next: (usuarios) => {
        this.listUsersBySection = usuarios || [];
        Loading.remove();
      },
      error: (e) => {
        this.listUsersBySection = [];
        Loading.remove();
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });

    this.findEventsToCalendar(this.getProfessionalToUpdate);

    this.toggleUpdateModal();

    this.updateDateForm
      .get('usuario')
      ?.valueChanges.pipe(
        tap((user) => {
          if (user) {
            this.getProfessionalToUpdate = user;
            Loading.dots('Cargando');
          } else {
            Loading.remove();
          }
        }),
        filter((user) => !!user),
        switchMap((user) =>
          this.agendaService.searchEventsByProfessionalAndDateInApi(
            user,
            this.formatedDateNow
          )
        )
      )
      .subscribe({
        next: (agenda) => {
          this.eventos = agenda;
          Loading.remove();
        },
        error: (e) => {
          this.eventos = [];
          Loading.remove();
          Report.failure(
            '¡Ups! Algo ha salido mal',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
  }

  // Formatea una fecha en el formato HH:mm
  formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  findEventsToCalendar(usuario: string) {
    Loading.dots('Cargando');

    this.agendaService
      .searchEventsByProfessionalAndDateInApi(usuario, this.formatedDateNow)
      .subscribe({
        next: (agenda) => {
          this.eventos = agenda;
          Loading.remove();
        },
        error: (e) => {
          this.eventos = [];
          Loading.remove();
          Report.failure(
            '¡Ups! Algo ha salido mal',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
  }

  updatePatientDate() {
    this.updateDateForm.get('fecha_consulta')?.setValue(this.formatedDateNow);
    this.updateDateForm.get('hora_consulta')?.setValue(this.formatedTimeNow);
    this.updateDateForm.get('detalle_agenda')?.setValue('Reagendado');
    this.updateDateForm
      .get('duracion_consulta')
      ?.setValue(this.defaultAppointmentTime);

    Confirm.show(
      'Actualización',
      `¿Cambiar datos de agendamiento?`,
      'Confirmar',
      'Cancelar',
      () => {
        this.agendaService
          .updateSchedulingInApi(
            this.idAgendamientoSelected,
            this.updateDateForm.value
          )
          .subscribe({
            next: (resp) => {
              Notify.success('Actualización exitosa');
              this.searchPatientString = '';
              this.patientInformation = Object.create([]);
              this.isAgendaFound = false;
              this.updateDateForm.reset(this.resetReservationForm);
              this.toggleUpdateModal();
            },
            error: (e) => {
              Report.failure('No actualizado', `${e.error.message}`, 'Volver');
              this.searchPatientString = '';
              this.patientInformation = Object.create([]);
              this.isAgendaFound = false;
              this.updateDateForm.reset(this.resetReservationForm);
              this.toggleUpdateModal();
            },
          });
      },
      () => {
        Notify.failure('Actualización cancelada');
      }
    );
  }

  toggleUpdateModal() {
    this.searchAgendaByProfessional();
    this.showUpdateModal = !this.showUpdateModal;
  }

  toggleUpdateModalClose() {
    this.updateDateForm.reset({
      fecha_consulta: '',
      hora_consulta: '',
    });
    this.showUpdateModal = false;
  }

  toggleCancelModal(agenda: Agendamiento) {
    const idAgendamientoSelected = agenda.id_agendamiento;
    this.cancelDateForm.get('detalle_agenda')?.setValue('Cancelado');
    Confirm.show(
      '¿Cancelar cita seleccionada?',
      'Esta acción no se podrá deshacer',
      'Si',
      'No',
      () => {
        this.cancelPatientDate(
          idAgendamientoSelected,
          this.cancelDateForm.value
        );
      },
      () => {
        return;
      }
    );
  }

  cancelPatientDate(id: string, status: Agendamiento) {
    this.agendaService.cancelSchedulingInApi(id, status).subscribe({
      next: (resp) => {
        Notify.success('La cita a sido cancelada.');
        this.cancelDateForm.reset({
          detalle_agenda: '',
          estado_agenda: false,
        });
        this.searchAgendaByProfessional();
      },
      error: (e) => {
        this.cancelDateForm.reset({
          detalle_agenda: '',
          estado_agenda: false,
        });
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
  }

  searchAgendaInformation() {
    if (this.searchPatientString) {
      Loading.dots('Obteniendo información');
      this.pacienteService
        .searchPatientMetadataInApi(this.searchPatientString)
        .subscribe({
          next: (resp) => {
            this.patientInformation = resp;
            this.patientNumerOfDates =
              this.patientInformation.agendamiento.length;

            this.isAgendaFound = true;
            Loading.remove();
          },
          error: (e) => {
            this.isAgendaFound = false;
            this.patientInformation = Object.create([]);
            Loading.remove();
            Report.failure(
              '¡Ups! Algo ha salido mal',
              `${e.error.message}`,
              'Volver'
            );
          },
        });
    } else {
      Report.warning(
        'Ingrese un valor',
        'Por favor, ingrese el numero de cédula del paciente',
        'Volver'
      );
    }
  }

  isAnEditableField(agenda: Agendamiento): boolean {
    if (agenda.detalle_agenda === 'Cancelado') {
      return false;
    }
    const stringDate = `${agenda.fecha_consulta}T${agenda.hora_consulta}`;
    const fechaCita = new Date(stringDate);
    return fechaCita >= this.getDateNow;
  }

  updateDate(event: any) {
    const newValue = event.target.value;

    if (this.formatedDateNow !== newValue) {
      this.formatedDateNow = newValue;
      this.findEventsToCalendar(this.getProfessionalToUpdate);
    }
  }

  updateTime(event: any) {
    const newValue = event.target.value;
    if (this.formatedTimeNow !== newValue) {
      this.formatedTimeNow = newValue;
    }
    // Verifica si la hora seleccionada ya está reservada
    const isTimeStartReserved = this.isTimeAlreadyReserved(
      this.formatedDateNow,
      this.formatedTimeNow,
      this.defaultAppointmentTime
    );

    this.checkScheduleAvailability(isTimeStartReserved);
  }

  updateAppointmentTime(event: any) {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue) && this.defaultAppointmentTime !== newValue) {
      this.defaultAppointmentTime = newValue;
    }

    // Verifica si la hora seleccionada ya está reservada
    const isTimeStartReserved = this.isTimeAlreadyReserved(
      this.formatedDateNow,
      this.formatedTimeNow,
      this.defaultAppointmentTime
    );

    this.checkScheduleAvailability(isTimeStartReserved);
  }

  isTimeAlreadyReserved(
    selectedDate: string,
    selectedTime: string,
    duration: number
  ): boolean {
    // Convierte la hora seleccionada a un formato compatible con tus eventos
    const selectedTimeAsDate = new Date(`${selectedDate}T${selectedTime}`);
    const endTimeAsDate = new Date(
      selectedTimeAsDate.getTime() + duration * 60000
    );

    this.formatedTimeEnd = this.formatTime(endTimeAsDate);

    return this.eventos.some((evento) => {
      const startTime = new Date(`${selectedDate}T${evento.start}`);
      const endTime = new Date(`${selectedDate}T${evento.end}`);
      return (
        (selectedTimeAsDate >= startTime && selectedTimeAsDate < endTime) ||
        (endTimeAsDate > startTime && endTimeAsDate <= endTime) ||
        (selectedTimeAsDate < startTime && endTimeAsDate > endTime)
      );
    });
  }

  checkScheduleAvailability(startTime: boolean) {
    if (startTime) {
      Notify.warning(
        'La hora seleccionada ya está reservada o superpone a una existente. Por favor, seleccione otra.'
      );
    } 
  }

  private createEndTime(fecha: string, hora: string, duracion: number): string {
    const startDate = this.createStartDate(fecha, hora);
    const endTime = new Date(startDate.getTime() + duracion * 60000);
    const hours = endTime.getHours().toString().padStart(2, '0');
    const minutes = endTime.getMinutes().toString().padStart(2, '0');
    const seconds = endTime.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private createStartDate(fecha: string, hora: string): Date {
    return new Date(`${fecha}T${hora}`);
  }

  onSearchInputChange() {
    if (this.searchPatientString === '') {
      this.isAgendaFound = false;
    }
  }

  onChangeSelection(value: any) {
    this.userFilterValue = value.target.value;
    this.searchAgendaByProfessional();
  }

  onPageChange(number: number) {
    this.logEvent(`pageChange(${number})`);
    this.config.currentPage = number;
  }

  onPageBoundsCorrection(number: number) {
    this.logEvent(`pageBoundsCorrection(${number})`);
    this.config.currentPage = number;
  }

  private logEvent(message: string) {
    this.eventLog.unshift(`${new Date().toISOString()}: ${message}`);
  }

  getStatusClass(detalle: string): string {
    switch (detalle) {
      case 'Cancelado':
        return 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300';
    }
  }

  getAssistanceClass(assistance: boolean): string {
    if (assistance) {
      return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300';
    } else {
      return 'bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300';
    }
  }

  get resetReservationForm() {
    return {
      usuario: '',
      detalle_agenda: '',
      fecha_consulta: '',
      hora_consulta: '',
      duracion_consulta: 30,
    };
  }
}
