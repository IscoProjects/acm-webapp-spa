import { Component, Input } from '@angular/core';
import { Confirm, Notify, Report, Loading } from 'notiflix';
import { tap, switchMap } from 'rxjs';
import { PacienteService } from '../../../proservices/paciente.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  Area,
  Eventos,
  Paciente,
  Seccion,
  Usuario,
} from 'src/app/protected/prointerfaces/api.interface';
import { AreaService } from '../../../proservices/area.service';
import { Router } from '@angular/router';
import { AgendamientoService } from '../../../proservices/agendamiento.service';
import { SeccionService } from 'src/app/protected/proservices/seccion.service';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';
import { NgSelectConfig } from '@ng-select/ng-select';

@Component({
  selector: 'app-create-agendamiento',
  templateUrl: './create-agendamiento.component.html',
  styleUrls: ['./create-agendamiento.component.css'],
})
export class CreateAgendamientoComponent {
  @Input()
  searchPatientString: string = '';

  get currentProfesional() {
    return this.authService.currentUser();
  }

  //Variables
  getDateNow: Date = new Date();
  formatedDateNow: string = this.getDateNow.toISOString().split('T')[0];
  formatedTimeNow: string = '';
  formatedTimeEnd: string = '';
  defaultAppointmentTime: number = 30;
  isPatientFound: boolean = false;
  showPolModal: boolean = false;
  showDateModal: boolean = false;
  professionalPreferenceName = '';
  professionalPreferenceId = '';

  //Checked
  isDemandaNoAgendadaChecked = false;
  isInterconsultaChecked = false;

  //Eventos
  eventos: Eventos[] = [];

  //Find data
  areasInformation: Area[] = [];
  sectionsInformation: Seccion[] = [];
  patientInformation: Paciente = Object.create([]);
  profesionalInformation: Usuario[] = [];

  //Formulario
  registerNewPatientDate: FormGroup = this.fb.group({
    usuario: [, [Validators.required]],
    paciente: [[Validators.required]],
    canal_agenda: [, [Validators.required]],
    detalle_agenda: [''],
    fecha_consulta: ['', [Validators.required]],
    hora_consulta: ['', [Validators.required]],
    duracion_consulta: ['', [Validators.required]],
    estado_agenda: true,
    pac_asistencia: false,
    pac_afiliacion: [],
    observaciones: [''],
    agendado_por: this.currentProfesional!.id_usuario,
  });

  //Areas-secciones-polivalentes
  searchAreasInformation: FormGroup = this.fb.group({
    area_agenda: [, [Validators.required]],
    seccion_agenda: [, [Validators.required]],
    usuario_referencia: [, [Validators.required]],
  });

  //Canal de agendamiento
  channelSchedulingList: string[] = [
    'Presencial',
    'Call Center 171',
    'Pagina Web',
  ];

  //Afiliacion del paciete
  patientAffiliationList: string[] = [
    'Ninguno',
    'IEES',
    'ISSFA',
    'Seguro Campesino',
  ];

  constructor(
    private authService: AuthService,
    private pacienteService: PacienteService,
    private areaService: AreaService,
    private seccionService: SeccionService,
    private agendamientoService: AgendamientoService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private router: Router,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.ngSelectConfig.appendTo = 'body';
  }

  searchPatientInfo() {
    if (!this.searchPatientString) {
      this.isPatientFound = false;
      Report.warning(
        'Ingrese un valor',
        'Por favor, ingrese el numero de cédula del paciente',
        'Volver'
      );
    } else {
      Loading.dots('Obteniendo información');
      this.pacienteService
        .searchPatientInApi(this.searchPatientString)
        .subscribe({
          next: (resp) => {
            this.patientInformation = resp;
            this.isPatientFound = true;
            this.searchAgendaInformationInApi();
            Loading.remove();
          },
          error: (e) => {
            this.isPatientFound = false;
            Loading.remove();
            Confirm.show(
              'Paciente no encontrado',
              '¿Quiere registrar un paciente nuevo?',
              'Registrar',
              'Volver',
              () => {
                this.router.navigateByUrl(
                  '/protected-route/agendador/pages/register-patient'
                );
              },
              () => {
                return;
              },
              {
                titleColor: '#1e1e1e',
                messageColor: '#242424',
                okButtonColor: '#fff',
                cancelButtonColor: '#fff',
                cancelButtonBackground: '#ff5549',
              }
            );
          },
        });
    }
  }

  createPatientDate() {
    switch (true) {
      case this.isDemandaNoAgendadaChecked:
        this.infoNewScheduling('Demanda no Agendada', false);
        break;

      case this.isInterconsultaChecked:
        this.infoNewScheduling('Interconsulta', true);
        break;

      default:
        this.infoNewScheduling('Consulta', true);
        break;
    }
  }

  infoNewScheduling(detail: string, state: boolean) {
    this.registerNewPatientDate
      .get('paciente')
      ?.setValue(this.patientInformation.id_paciente);
    this.registerNewPatientDate.get('detalle_agenda')?.setValue(detail);
    this.registerNewPatientDate.get('estado_agenda')?.setValue(state);

    Confirm.show(
      'Confirmar cita',
      `Paciente: ${this.patientInformation.pac_cedula}. Fecha: ${
        this.registerNewPatientDate.get('fecha_consulta')?.value
      }. Hora: ${this.registerNewPatientDate.get('hora_consulta')?.value}.`,
      'Confirmar',
      'Cancelar',
      () => {
        this.agendamientoService
          .addNewSchedulingInApi(this.registerNewPatientDate.value)
          .subscribe({
            next: (resp) => {
              this.isPatientFound = false;
              this.registerNewPatientDate.reset(this.resetReservationForm);
              this.searchAreasInformation.reset(this.resetAreasInformation);
              this.isDemandaNoAgendadaChecked = false;
              this.isInterconsultaChecked = false;
              this.searchPatientString = '';
              this.resetFormatedTime();
              Notify.success('Agendamiento registrado exitosamente');
            },
            error: (e) => {
              this.isPatientFound = false;
              this.registerNewPatientDate.reset(this.resetReservationForm);
              this.searchAreasInformation.reset(this.resetAreasInformation);
              this.isDemandaNoAgendadaChecked = false;
              this.isInterconsultaChecked = false;
              this.searchPatientString = '';
              this.resetFormatedTime();
              Report.failure(
                '¡Ups! Algo ha salido mal',
                `${e.error.message}`,
                'Volver'
              );
            },
          });

        this.areaService.searchAllAreasInApi().subscribe({
          next: (area) => {
            this.areasInformation = area;
          },
          error: (e) => {
            this.areasInformation = [];
          },
        });
      },
      () => {
        Notify.failure('Agendamiento cancelado');
      }
    );
  }

  searchAgendaByPol() {
    Loading.dots('Cargando...');
    this.agendamientoService
      .searchEventsByProfessionalAndDateInApi(
        this.registerNewPatientDate.get('usuario')?.value,
        this.formatedDateNow
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

  togglePolModal() {
    this.showPolModal = !this.showPolModal;
  }

  togglePolModalAccept() {
    this.professionalPreferenceId =
      this.registerNewPatientDate.get('usuario')?.value;
    this.getProfessionalPreference(this.professionalPreferenceId);
    this.showPolModal = !this.showPolModal;
  }

  togglePolModalClose() {
    if (this.professionalPreferenceId) {
      this.registerNewPatientDate
        .get('usuario')
        ?.setValue(this.professionalPreferenceId);
    } else {
      this.registerNewPatientDate.get('usuario')?.reset();
    }
    this.togglePolModal();
  }

  toggleOpenDateModal() {
    const getTimeNow = new Date();
    this.formatedTimeNow = this.formatTime(getTimeNow);
    this.searchAgendaByPol();

    this.showDateModal = !this.showDateModal;
  }

  toggleCloseDateModal() {
    this.registerNewPatientDate.get('fecha_consulta')?.reset('');
    this.registerNewPatientDate.get('hora_consulta')?.reset('');
    this.registerNewPatientDate.get('duracion_consulta')?.reset('');
    this.formatedDateNow = this.getDateNow.toISOString().split('T')[0];
    this.showDateModal = !this.showDateModal;
  }

  toggleDateModalSubmit() {
    this.registerNewPatientDate
      .get('fecha_consulta')
      ?.setValue(this.formatedDateNow);
    this.registerNewPatientDate
      .get('hora_consulta')
      ?.setValue(this.formatedTimeNow);
    this.registerNewPatientDate
      .get('duracion_consulta')
      ?.setValue(this.defaultAppointmentTime);

    this.showDateModal = !this.showDateModal;
  }

  // Formatea una fecha en el formato HH:mm
  formatTime(date: Date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  searchAgendaInformationInApi() {
    this.areaService.searchAllAreasInApi().subscribe({
      next: (area) => {
        this.areasInformation = area.filter(
          (area) => area.isAvailible === true
        );
      },
      error: (e) => {
        this.areasInformation = [];
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });

    this.searchAreasInformation
      .get('area_agenda')
      ?.valueChanges.pipe(
        tap(() => {
          this.searchAreasInformation.get('seccion_agenda')?.reset();
          Loading.dots('Cargando');
        }),
        switchMap((area) => this.seccionService.searchSectionByAreaInApi(area))
      )
      .subscribe({
        next: (seccion) => {
          if (seccion !== null) {
            this.sectionsInformation = seccion!.filter(
              (seccion) => seccion.isAvailible === true
            );
          } else {
            this.sectionsInformation = [];
          }
          Loading.remove();
        },
        error: (e) => {
          this.sectionsInformation = [];
          Loading.remove();
          Report.failure(
            '¡Ups! Algo ha salido mal',
            `${e.error.message}`,
            'Volver'
          );
        },
      });

    this.searchAreasInformation
      .get('seccion_agenda')
      ?.valueChanges.pipe(
        tap(() => {
          this.registerNewPatientDate.get('usuario')?.reset();
          this.registerNewPatientDate.get('fecha_consulta')?.reset('');
          this.professionalPreferenceName = '';
          Loading.dots('Cargando');
        }),
        switchMap((seccion) =>
          this.usuarioService.searchUsersBySectionFromApi(seccion)
        )
      )
      .subscribe({
        next: (usuarios) => {
          if (usuarios !== null) {
            this.profesionalInformation = usuarios.filter(
              (user) => user.us_isActive === true
            );
            this.getAppointmensByUser();
          } else {
            this.profesionalInformation = [];
          }
          Loading.remove();
        },
        error: (e) => {
          this.profesionalInformation = [];
          Loading.remove();
          Report.failure(
            '¡Ups! Algo ha salido mal',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
  }

  getAppointmensByUser() {
    this.profesionalInformation.forEach((user) =>
      this.searchAppointmentByMedico(user.id_usuario, this.formatedDateNow)
    );
  }

  searchAppointmentByMedico(id_usuario: string, date: string) {
    this.agendamientoService
      .searchAgendaByProfessionalAndDateInApi(id_usuario, date)
      .subscribe({
        next: (agendamientos) => {
          let num = agendamientos.length;
          const usuario = this.profesionalInformation.find(
            (user) => user.id_usuario === id_usuario
          );

          if (usuario) {
            usuario.numTurnos = num;
          }
        },
        error: (e) => {
          const usuario = this.profesionalInformation.find(
            (user) => user.id_usuario === id_usuario
          );
          if (usuario) {
            usuario.numTurnos = 0;
          }
        },
      });
  }

  onEvaluateDemand(event: any) {
    this.isDemandaNoAgendadaChecked = event.target.checked;
    this.isInterconsultaChecked = false;
  }

  onEvaluateInterconsulta(event: any) {
    this.isInterconsultaChecked = event.target.checked;
    this.isDemandaNoAgendadaChecked = false;
  }

  getStringStyle(estado: boolean): string {
    if (estado) {
      return 'flex bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300';
    } else {
      return 'flex bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300';
    }
  }

  getAppointmentLengthStyle(len: number): string {
    if (len < 16) {
      return 'flex bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300';
    } else {
      return 'flex bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300';
    }
  }

  getProfessionalPreference(id: string) {
    const user = this.profesionalInformation.find(
      (user) => user.id_usuario === id
    );
    this.professionalPreferenceName =
      user?.us_apellidos + ' ' + user?.us_nombres;
  }

  updateDate(event: any) {
    const newValue = event.target.value;
    if (this.formatedDateNow !== newValue) {
      this.formatedDateNow = newValue;
      this.searchAgendaByPol();
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

  resetFormatedTime() {
    this.formatedDateNow = this.getDateNow.toISOString().split('T')[0];
    this.formatedTimeEnd = '';
    this.defaultAppointmentTime = 30;
  }

  get resetReservationForm() {
    return {
      usuario: '',
      paciente: null,
      canal_agenda: null,
      detalle_agenda: '',
      fecha_consulta: '',
      hora_consulta: '',
      duracion_consulta: '',
      estado_agenda: true,
      pac_asistencia: false,
      pac_afiliacion: null,
      observaciones: '',
      agendado_por: this.currentProfesional!.id_usuario,
    };
  }

  get resetAreasInformation() {
    return {
      area_agenda: null,
      seccion_agenda: '',
      pol_agenda: '',
    };
  }
}
