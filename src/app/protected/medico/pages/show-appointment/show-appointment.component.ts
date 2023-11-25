import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsuarioService } from '../../../proservices/usuario.service';
import {
  Usuario,
  Agendamiento,
  Consulta,
  EstacionTrabajo,
} from '../../../prointerfaces/api.interface';
import { AgendamientoService } from '../../../proservices/agendamiento.service';
import { ConsultaService } from 'src/app/protected/proservices/consulta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { Subscription, forkJoin, map } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { SocketService } from 'src/app/protected/proservices/socket.service';

@Component({
  selector: 'app-show-appointment',
  templateUrl: './show-appointment.component.html',
  styleUrls: ['./show-appointment.component.css'],
})
export class ShowAppointmentComponent implements OnInit {
  get currentProfesional() {
    return this.authService.currentUser();
  }

  userInformation: Usuario = Object.create([]);
  userPolivalente: EstacionTrabajo = Object.create([]);
  formatedDateNow: string = new Date().toISOString().split('T')[0];
  formatedTimeStart: string = '';
  formatedTimeEnd: string = '';
  agendaInformation: Agendamiento[] = [];
  agendadoStateArray: Agendamiento[] = [];
  atendidoStateArray: Agendamiento[] = [];
  ausenteStateArray: Agendamiento[] = [];
  pendienteStateArray: Agendamiento[] = [];
  agendaTotalNumber: number = 0;
  agendaAtendidosNumber: number = 0;
  agendaPendientesNumber: number = 0;
  agendaAusentesNumber: number = 0;
  initialState: string = 'pendientes';
  showAgendaInformation: Agendamiento[] = [];
  idAgendamiento: string = '';
  // tiempo
  tiempoEspera: number = 0;
  selectedDateCita?: Date;
  //modal
  showConsultModal: boolean = false;
  //Porcentajes
  porcentajeAtendidos: string = '';
  porcentajePendientes: string = '';
  porcentajeCuposAgendados: string = '';

  //Time Form
  registConsultationInformation: FormGroup = this.fb.group({
    agendamiento: ['', [Validators.required]],
    med_responsable: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    hora_registro: ['', [Validators.required]],
    tiempo_espera: [Validators.required],
    observaciones: '',
  });

  //Agenda Settings
  registerPatientAttendance = { estado_agenda: false, pac_asistencia: true };

  //Socket mssg
  public message: string = '';
  private subscriptions: Subscription[] = [];
  private token: string = localStorage.getItem('token')!;

  constructor(
    private authService: AuthService,
    private userService: UsuarioService,
    private agendaService: AgendamientoService,
    private consultaService: ConsultaService,
    private fb: FormBuilder,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    Loading.standard('Obteniendo información');
    this.searchUserInformation();
    this.searchUserAgenda();
    Loading.remove();
  }

  ngAfterViewInit() {
    this.socketService.connect();

    this.subscriptions.push(
      this.socketService.fromEvent('connect').subscribe(() => {
        console.log('Conectado al servidor de WebSockets');
      }),
      this.socketService.fromEvent('agendamiento').subscribe((agendamiento) => {
        const agendamientoTyped = agendamiento as Agendamiento;
        console.log({ agendamientoTyped });
        const newAppointmentTime = agendamientoTyped.hora_consulta;
        Notify.info(
          `Recordatorio: Nueva cita agendada para las ${newAppointmentTime} horas`,
          {
            closeButton: true,
          }
        );
        this.searchUserAgenda();
        //TODO:Notification
        // this.playNotification();
      }),
      this.socketService.fromEvent('disconnect').subscribe(() => {
        console.log('Desconectado del servidor');
      })
    );
    console.log(this.subscriptions);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    console.log('Destroy:', this.subscriptions);
  }

  searchUserInformation() {
    this.userService
      .searchUserInfoInApi(this.currentProfesional!.id_usuario)
      .subscribe({
        next: (resp) => {
          this.userInformation = resp;
          this.userPolivalente = this.userInformation.estacion_trabajo;
        },
        error: (e) => {
          this.userInformation = Object.create([]);
        },
      });
  }

  searchUserAgenda() {
    this.agendaService
      .searchAgendaByProfessionalAndDateInApi(
        this.currentProfesional!.id_usuario,
        this.formatedDateNow
      )
      .subscribe({
        next: (response) => {
          this.agendaInformation = response;
          console.log(this.agendaInformation);
          this.getFilteredData();
          console.log(this.formatedDateNow);
        },
        error: (e) => {
          this.agendaInformation = [];
          Report.failure(
            '¡Ups! Algo ha salido mal',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
  }

  getFilteredData() {
    this.filterAgenda(this.agendaInformation);
    this.setFilteredData(this.initialState);
  }

  setFilteredData(state: string) {
    const stateMappings: { [key: string]: Agendamiento[] } = {
      agendados: this.agendadoStateArray,
      atendidos: this.atendidoStateArray,
      pendientes: this.pendienteStateArray,
      inasistencias: this.ausenteStateArray,
    };

    this.showAgendaInformation = stateMappings[state] || [];
  }

  filterAgenda(agendamientos: Agendamiento[]) {
    this.agendadoStateArray = agendamientos;
    this.atendidoStateArray = agendamientos.filter(
      (agendamiento) => agendamiento.pac_asistencia === true
    );
    this.pendienteStateArray = agendamientos.filter(
      (agendamiento) => agendamiento.estado_agenda === true
    );
    this.ausenteStateArray = agendamientos.filter(
      (agendamiento) =>
        !agendamiento.estado_agenda && !agendamiento.pac_asistencia
    );

    this.agendaTotalNumber = this.agendadoStateArray.length;
    this.agendaAtendidosNumber = this.atendidoStateArray.length;
    this.agendaPendientesNumber = this.pendienteStateArray.length;
    this.porcentajeAtendidos = (
      (this.agendaAtendidosNumber / this.agendaTotalNumber) *
      100
    ).toFixed(2);
    this.porcentajePendientes = (
      (this.agendaPendientesNumber / this.agendaTotalNumber) *
      100
    ).toFixed(2);
    this.porcentajeCuposAgendados = (
      (this.agendaTotalNumber / 16) *
      100
    ).toFixed(2);
  }

  onChangeSelection() {
    console.log(this.initialState);
    this.searchUserAgenda();
  }

  openToggleConsultModal(agenda: Agendamiento) {
    this.showConsultModal = true;
    this.formatedTimeStart = this.getActualTime();
    console.log(agenda.id_agendamiento);
    this.idAgendamiento = agenda.id_agendamiento;
    this.selectedDateCita = agenda.fecha_agenda;
    let patient = agenda.paciente?.pac_cedula;

    Confirm.show(
      'Registrar Cita',
      `¿Desea registrar la asistencia del paciente: ${patient}?. Esta acción no se puede deshacer`,
      'Aceptar',
      'Cancelar',
      () => {
        this.saveConsultInformation();
        return;
      },
      () => {
        this.showConsultModal = false;
        return;
      }
    );
  }

  openToggleCloseConsultModal(agenda: Agendamiento) {
    this.idAgendamiento = agenda.id_agendamiento;
    this.selectedDateCita = agenda.fecha_agenda;
    Confirm.prompt(
      'Finalizar Cita',
      `¿Desea cerrar cita de las ${agenda.hora_consulta}?. Esta acción no se puede deshacer`,
      'No responde al llamado',
      'Finalizar',
      'Cancelar',
      (professionalComment) => {
        this.saveNonAttendanceInformation(
          this.idAgendamiento,
          this.selectedDateCita!,
          professionalComment
        );
      },
      () => {
        this.registConsultationInformation.reset(
          this.resetConsultationInformation
        );
        return;
      },
      {}
    );
  }

  getFormatedTime(tiempo: number): string {
    const horas = Math.floor(tiempo / 3600);
    const minutos = Math.floor((tiempo % 3600) / 60);
    const segundos = tiempo % 60;
    return (
      this.formatNumber(horas) +
      ':' +
      this.formatNumber(minutos) +
      ':' +
      this.formatNumber(segundos)
    );
  }

  getActualTime() {
    let fecha = new Date();
    const hora = fecha.getHours();
    const minutos = fecha.getMinutes();
    const segundos = fecha.getSeconds();

    return `${this.formatNumber(hora)}:${this.formatNumber(
      minutos
    )}:${this.formatNumber(segundos)}`;
  }

  formatNumber(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }

  saveConsultInformation() {
    this.registerPatientAttendance.estado_agenda = false;
    this.registerPatientAttendance.pac_asistencia = true;
    this.formatedTimeEnd = this.getActualTime();
    this.tiempoEspera = this.calcularTiempoEspera(
      this.selectedDateCita!,
      this.formatedDateNow,
      this.formatedTimeStart
    );

    this.registConsultationInformation
      .get('agendamiento')
      ?.setValue(this.idAgendamiento);
    this.registConsultationInformation
      .get('med_responsable')
      ?.setValue(this.currentProfesional!.id_usuario);
    this.registConsultationInformation
      .get('fecha')
      ?.setValue(this.formatedDateNow);
    this.registConsultationInformation
      .get('hora_registro')
      ?.setValue(this.formatedTimeStart);
    this.registConsultationInformation
      .get('tiempo_espera')
      ?.setValue(this.tiempoEspera);

    this.sendInformationToSave(
      this.idAgendamiento,
      this.registerPatientAttendance,
      this.registConsultationInformation.value
    );
    this.closeToggleConsultModal();
  }

  saveNonAttendanceInformation(
    id: string,
    appointmentDate: Date,
    comment: string
  ) {
    this.registerPatientAttendance.estado_agenda = false;
    this.registerPatientAttendance.pac_asistencia = false;
    this.formatedTimeStart = this.getActualTime();
    this.formatedTimeEnd = this.formatedTimeStart;
    this.tiempoEspera = this.calcularTiempoEspera(
      appointmentDate,
      this.formatedDateNow,
      this.formatedTimeStart
    );

    this.registConsultationInformation.get('agendamiento')?.setValue(id);
    this.registConsultationInformation
      .get('med_responsable')
      ?.setValue(this.currentProfesional!.id_usuario);
    this.registConsultationInformation
      .get('fecha')
      ?.setValue(this.formatedDateNow);
    this.registConsultationInformation
      .get('hora_registro')
      ?.setValue(this.formatedTimeStart);
    this.registConsultationInformation
      .get('tiempo_espera')
      ?.setValue(this.tiempoEspera);
    this.registConsultationInformation.get('observaciones')?.setValue(comment);

    this.sendInformationToSave(
      this.idAgendamiento,
      this.registerPatientAttendance,
      this.registConsultationInformation.value
    );
  }

  sendInformationToSave(id_agenda: string, done: any, info: Consulta) {
    forkJoin([
      this.agendaService.updateSchedulingStateInApi(id_agenda, done),
      this.consultaService.setConsultationInformation(info),
    ]).subscribe({
      next: ([agendaResponse, consultaResponse]) => {
        console.log(agendaResponse, consultaResponse);
        this.registConsultationInformation.reset(
          this.resetConsultationInformation
        );
        this.ngOnInit();
        Notify.success('Datos de consulta registrados correctamente');
      },
      error: (e) => {
        this.registConsultationInformation.reset(
          this.resetConsultationInformation
        );
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
  }

  calcularTiempoEspera(
    fecha_agenda: Date,
    consulta_fecha: string,
    consulta_hora: string
  ): number {
    const fechaAgendamiento = new Date(fecha_agenda);
    const fechaConsulta = new Date(consulta_fecha + 'T' + consulta_hora);

    const tiempoEnMilisegundos =
      fechaConsulta.getTime() - fechaAgendamiento.getTime();

    const segundos = Math.floor(tiempoEnMilisegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    // const horas = Math.floor(minutos / 60);

    return minutos;
  }

  closeToggleConsultModal() {
    this.showConsultModal = false;
  }

  enableButton(modalActive: boolean, isConsultationDone: boolean): boolean {
    return modalActive || !isConsultationDone;
  }

  getAssistanceClass(assistance: boolean): string {
    if (assistance) {
      return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-green-900 dark:text-green-300';
    } else {
      return 'bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-1 rounded dark:bg-orange-800 dark:text-orange-300';
    }
  }

  getBorderedStyle(assistance: boolean): { [klass: string]: any } {
    if (assistance) {
      return {
        'border-left-color': 'rgb(34 197 94)',
      };
    } else {
      return {
        'border-left-color': 'rgb(249 115 22)',
      };
    }
  }

  get resetConsultationInformation() {
    return {
      agendamiento: '',
      med_responsable: '',
      fecha: '',
      hora_registro: '',
      tiempo_espera: '',
      observaciones: '',
    };
  }

  // playNotification() {
  //   let audio = new Audio();
  //   audio.src = '../../../../../assets/sounds/notification.mp3';
  //   audio.load();
  //   audio.play();
  // }
}
