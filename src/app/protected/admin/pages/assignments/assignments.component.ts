import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { PaginationInstance } from 'ngx-pagination';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { switchMap, tap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Area,
  EstacionTrabajo,
  Seccion,
  Usuario,
} from 'src/app/protected/prointerfaces/api.interface';
import { AreaService } from 'src/app/protected/proservices/area.service';
import { PolivalenteService } from 'src/app/protected/proservices/polivalente.service';
import { SeccionService } from 'src/app/protected/proservices/seccion.service';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';

@Component({
  selector: 'app-assignments',
  templateUrl: './assignments.component.html',
  styleUrls: ['./assignments.component.css'],
})
export class AssignmentsComponent implements OnInit {
  @Input('data') userInformation: Usuario[] = [];

  //Obtener usuario actual
  get currentProfesional() {
    return this.authService.currentUser();
  }

  //Paginacion
  public searchUserString: string = '';
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = false;
  public config: PaginationInstance = {
    id: 'advanced',
    itemsPerPage: 25,
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
  showNewUserModal: boolean = false;
  showReassignmentModal: boolean = false;
  temporaryStatus = { us_isActive: false };
  temporaryUserSelected: Usuario = Object.create([]);
  areasInformation: Area[] = [];
  sectionsInformation: Seccion[] = [];
  polsInformation: EstacionTrabajo[] = [];
  polivalente: string = '';
  userSelectedMssg: string = '';

  //Agregar nuevo usuario
  addUserForm: FormGroup = this.fb.group({
    estacion_trabajo: ['', Validators.required],
    us_cedula: [
      '',
      [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.minLength(8),
        Validators.maxLength(12),
      ],
    ],
    us_nombres: ['', [Validators.required, Validators.minLength(3)]],
    us_apellidos: ['', [Validators.required, Validators.minLength(3)]],
    us_isActive: [true, Validators.required],
    us_carrera: ['', [Validators.required, Validators.minLength(3)]],
    us_telefono: ['', [Validators.pattern('[0-9]+'), Validators.maxLength(12)]],
    us_fecha_nac: ['', Validators.required],
    us_sexo: [, Validators.required],
    us_user: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(24)],
    ],
    us_password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(24)],
    ],
    us_role: [, Validators.required],
  });

  //Areas-secciones-polivalentes
  searchAreasInformation: FormGroup = this.fb.group({
    area_agenda: [, [Validators.required]],
    seccion_agenda: [, [Validators.required]],
    pol_agenda: [, [Validators.required]],
  });

  //Reasignacion de usuario
  reassignmentUser = { estacion_trabajo: '' };

  //Genero
  genre: string[] = ['Masculino', 'Femenino', 'Otro'];

  //ROles
  userRol: string[] = ['Administrador', 'Agendador', 'Medico'];
  // changeUserAssignment: FormGroup = this.fb.group({});

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private polivalenteService: PolivalenteService,
    private areaService: AreaService,
    private seccionService: SeccionService,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.ngSelectConfig.appendTo = 'body';
  }

  ngOnInit(): void {
    this.loadProfessionalsInformation();
  }

  private loadProfessionalsInformation() {
    Loading.pulse('Obteniendo información');
    this.usuarioService.searchAllUsersMetadataFromApi().subscribe({
      next: (response) => {
        this.userInformation = response;
        Loading.remove();
        console.log(this.userInformation);
      },
      error: (e) => {
        this.userInformation = Object.create([]);
        Loading.remove();
        Report.failure('Not Found', `${e.error.message}`, 'Volver');
      },
    });
  }

  updateUserStatus(id_usuario: string, nombre: string, estado: boolean) {
    this.temporaryStatus.us_isActive = !estado;
    Confirm.show(
      'Actualización',
      `¿Está seguro de actualizar el estado actual del Usuario '${nombre}'?`,
      'Aceptar',
      'Cancelar',
      () => {
        this.usuarioService
          .updateUserStateInApi(id_usuario, this.temporaryStatus)
          .subscribe({
            next: (resp) => {
              console.log(resp);
              Notify.success('Actualización exitosa');
              this.loadProfessionalsInformation();
            },
            error: (e) => {
              Report.failure('No actualizado', `${e.error.message}`, 'Volver');
            },
          });
      },
      () => {
        this.loadProfessionalsInformation();
      },
      {}
    );
  }

  createNewUserInformation() {
    console.log(this.addUserForm.valid);
    console.log(this.addUserForm.value);
    console.log(this.polivalente);
    this.usuarioService.addNewSeccionInApi(this.addUserForm.value).subscribe({
      next: (resp) => {
        console.log(resp);
        Notify.success('Registro exitoso');
        this.loadProfessionalsInformation();
      },
      error: (e) => {
        Report.failure(
          '¡Ups! Algo ha salido mal, vuelve a intentar más tarde.',
          `${e.error.message}`,
          'Volver'
        );
        this.loadProfessionalsInformation();
      },
    });
    this.toggleCreateModalClose();
  }

  reassignmentUserInformation() {
    this.reassignmentUser.estacion_trabajo =
      this.searchAreasInformation.get('pol_agenda')?.value;
    console.log(
      'Id:',
      this.temporaryUserSelected,
      ' Pol: ',
      this.reassignmentUser
    );

    Confirm.show(
      'Actualización',
      `Guardar nueva información de asignación`,
      'Confirmar',
      'Cancelar',
      () => {
        this.usuarioService
          .updateUserAssignmentInApi(
            this.temporaryUserSelected.id_usuario,
            this.reassignmentUser
          )
          .subscribe({
            next: (resp) => {
              console.log(resp);
              Notify.success('Actualización exitosa');
              this.loadProfessionalsInformation();
              this.toggleReassignmentModalClose();
            },
            error: (e) => {
              Report.failure('No actualizado', `${e.error.message}`, 'Volver');
              this.toggleReassignmentModalClose();
            },
          });
      },
      () => {
        Notify.failure('Actualización cancelada');
      }
    );
  }

  searchAgendaInformationInApi() {
    this.areaService.searchAllAreasInApi().subscribe({
      next: (area) => {
        this.areasInformation = area.filter(
          (area) => area.isAvailible === true
        );
        console.log(this.areasInformation);
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
          Loading.pulse('Cargando');
        }),
        switchMap((area) => this.seccionService.searchSectionByAreaInApi(area))
      )
      .subscribe({
        next: (seccion) => {
          if (seccion !== null) {
            this.sectionsInformation = seccion.filter(
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
          this.searchAreasInformation.get('pol_agenda')?.reset();
          Loading.pulse('Cargando');
        }),
        switchMap((seccion) =>
          this.polivalenteService.searchPolBySectionInAPi(seccion)
        )
      )
      .subscribe({
        next: (polivalente) => {
          if (polivalente !== null) {
            this.handlePolivalenteResult(polivalente);
            console.log(this.polsInformation);
          } else {
            this.polsInformation = [];
          }
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

    this.searchAreasInformation.controls['pol_agenda'].valueChanges.subscribe(
      (value) => {
        this.addUserForm.patchValue({
          estacion_trabajo: value,
        });
      }
    );
  }

  toggleCreateModal() {
    this.searchAgendaInformationInApi();
    this.showNewUserModal = !this.showNewUserModal;
  }

  toggleCreateModalClose() {
    this.addUserForm.reset(this.resetUserInformation);
    this.searchAreasInformation.reset(this.resetAreasInformation);
    console.log(this.addUserForm.value);
    this.toggleCreateModal();
  }

  toggleReassignmentModal(user: Usuario) {
    this.temporaryUserSelected = user;
    this.userSelectedMssg = `El usuario seleccionado se encuentra ubicado actualmente en el Área: ${user.estacion_trabajo.seccion.area.descripcion}, en la Sección: ${user.estacion_trabajo.seccion.descripcion} y en Pol/Módulo: ${user.estacion_trabajo.descripcion}. En caso de querer cambiar dicha información, por favor, llene los campos a continuación.`;
    this.searchAgendaInformationInApi();
    this.showReassignmentModal = !this.showReassignmentModal;
  }

  toggleReassignmentModalClose() {
    this.reassignmentUser.estacion_trabajo = '';
    this.searchAreasInformation.reset(this.resetAreasInformation);
    this.showReassignmentModal = !this.showReassignmentModal;
    this.temporaryUserSelected = Object.create([]);
    this.userSelectedMssg = '';
    console.log(this.reassignmentUser);
  }

  private handlePolivalenteResult(polivalente: EstacionTrabajo[]) {
    this.polsInformation = polivalente.filter(
      (pols) =>
        pols.isAvailible && !pols.usuario.some((usuario) => usuario.us_isActive)
    );
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

  getStatusClass(estado: boolean): string {
    if (estado) {
      return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300';
    } else {
      return 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300';
    }
  }

  get resetUserInformation() {
    return {
      polivalente: '',
      us_cedula: '',
      us_nombres: '',
      us_apellidos: '',
      us_isActive: true,
      us_carrera: '',
      us_telefono: '',
      us_fecha_nac: '',
      us_sexo: null,
      us_user: '',
      us_password: '',
      us_role: null,
    };
  }

  get resetAreasInformation() {
    return {
      area_agenda: null,
      seccion_agenda: null,
      pol_agenda: null,
    };
  }
}
