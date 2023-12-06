import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  Area,
  EstacionTrabajo,
  Seccion,
} from 'src/app/protected/prointerfaces/api.interface';
import { AreaService } from '../../../proservices/area.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeccionService } from 'src/app/protected/proservices/seccion.service';
import { PolivalenteService } from 'src/app/protected/proservices/polivalente.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-area-distribution',
  templateUrl: './area-distribution.component.html',
  styleUrls: ['./area-distribution.component.css'],
})
export class AreaDistributionComponent implements OnInit {
  @Input('data') areaInformation: Area[] = [];
  @Input('data') seccionInformation: Seccion[] = [];
  @Input('data') polivalenteInformation: EstacionTrabajo[] = [];

  //Obtener usuario actual
  get currentProfesional() {
    return this.authService.currentUser();
  }

  //Paginacion
  public searchAreaString: string = '';
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
  showNewAreaModal: boolean = false;
  temporaryStatus = { isAvailible: false };
  showNewSeccionModal: boolean = false;
  showNewPolModal: boolean = false;
  createSectionInformation: string = '';
  createPolInformation: string = '';

  //Agregar nueva area
  addAreaForm: FormGroup = this.fb.group({
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    isAvailible: [true, Validators.required],
  });

  //Agregar nueva seccion
  addSeccionForm: FormGroup = this.fb.group({
    area: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    isAvailible: [true, Validators.required],
  });

  //Agregar nuevo polivalente
  addNewPolForm: FormGroup = this.fb.group({
    seccion: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(5)]],
    isAvailible: [true, Validators.required],
  });

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private areaService: AreaService,
    private seccionService: SeccionService,
    private polivalenteService: PolivalenteService
  ) {}

  ngOnInit(): void {
    Loading.pulse('Obteniendo información');
    forkJoin([
      this.areaService.searchAllAreasInApi(),
      this.seccionService.searchAllSectionInApi(),
      this.polivalenteService.searchAllPolInApi(),
    ]).subscribe({
      next: ([areas, secciones, polivalentes]) => {
        this.areaInformation = areas;
        this.seccionInformation = secciones;
        this.polivalenteInformation = polivalentes;
        Loading.remove();
      },
      error: (e) => {
        this.areaInformation = [];
        this.seccionInformation = [];
        this.polivalenteInformation = [];
        Loading.remove();
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
  }

  updateAreaState(id_area: string, estado: boolean) {
    this.temporaryStatus.isAvailible = !estado;
    Confirm.show(
      'Actualización',
      '¿está seguro de realizar los cambios?',
      'Aceptar',
      'Cancelar',
      () => {
        this.areaService
          .updateAreaStateInApi(id_area, this.temporaryStatus)
          .subscribe({
            next: (resp) => {
              Notify.success('Actualización exitosa');
              this.ngOnInit();
            },
            error: (e) => {
              Report.failure('No actualizado', `${e.error.message}`, 'Volver');
            },
          });
      },
      () => {
        this.ngOnInit();
      },
      {}
    );
  }

  updateSeccionState(id_seccion: string, estado: boolean) {
    this.temporaryStatus.isAvailible = !estado;
    Confirm.show(
      'Actualización',
      '¿está seguro de realizar los cambios?',
      'Aceptar',
      'Cancelar',
      () => {
        this.seccionService
          .updateSeccionStateInApi(id_seccion, this.temporaryStatus)
          .subscribe({
            next: (resp) => {
              Notify.success('Actualización exitosa');
              this.ngOnInit();
            },
            error: (e) => {
              Report.failure('No actualizado', `${e.error.message}`, 'Volver');
            },
          });
      },
      () => {
        this.ngOnInit();
      },
      {}
    );
  }

  updatePolState(id_polivalente: string, estado: boolean) {
    this.temporaryStatus.isAvailible = !estado;
    Confirm.show(
      'Actualización',
      '¿está seguro de realizar los cambios?',
      'Aceptar',
      'Cancelar',
      () => {
        this.polivalenteService
          .updatePolivalenteStateInApi(id_polivalente, this.temporaryStatus)
          .subscribe({
            next: (resp) => {
              Notify.success('Actualización exitosa');
              this.ngOnInit();
            },
            error: (e) => {
              Report.failure('No actualizado', `${e.error.message}`, 'Volver');
            },
          });
      },
      () => {
        this.ngOnInit();
      },
      {}
    );
  }

  createNewAreaInformation() {
    this.areaService.addNewAreaInApi(this.addAreaForm.value).subscribe({
      next: (resp) => {
        Notify.success('Registro exitoso');
        this.ngOnInit();
      },
      error: (e) => {
        Report.failure(
          '¡Ups! Algo ha salido mal, vuelve a intentar más tarde.',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
    this.toggleCreateAreaModalClose();
  }

  createNewSeccionInformation() {
    this.seccionService
      .addNewSeccionInApi(this.addSeccionForm.value)
      .subscribe({
        next: (resp) => {
          Notify.success('Registro exitoso');
          this.ngOnInit();
        },
        error: (e) => {
          Report.failure(
            '¡Ups! Algo ha salido mal, vuelve a intentar más tarde.',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
    this.toggleCreateSeccionModalClose();
  }

  createNewPolivalenteInformation() {
    this.polivalenteService
      .addNewPolivalenteInApi(this.addNewPolForm.value)
      .subscribe({
        next: (resp) => {
          Notify.success('Registro exitoso');
          this.ngOnInit();
        },
        error: (e) => {
          Report.failure(
            '¡Ups! Algo ha salido mal, vuelve a intentar más tarde.',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
    this.toggleCreatePolModalClose();
  }

  toggleCreateAreaModal() {
    this.showNewAreaModal = !this.showNewAreaModal;
  }

  toggleCreateAreaModalClose() {
    this.addAreaForm.reset(this.resetAreaInformation);
    this.toggleCreateAreaModal();
  }

  toggleCreateSeccionModal(area: Area) {
    this.createSectionInformation = `Se creará una nueva sección que pertenece al área de ${area.descripcion}. Por favor, llene los campos a continuación...`;
    this.addSeccionForm.get('area')?.setValue(area.id_area);
    this.showNewSeccionModal = !this.showNewSeccionModal;
  }

  toggleCreateSeccionModalClose() {
    this.addSeccionForm.reset(this.resetSeccionInformation);
    this.showNewSeccionModal = false;
  }

  toggleCreatePolModal(seccion: Seccion) {
    this.createPolInformation = `Se creará un nuevo Polivalente/Módulo a la sección ${seccion.descripcion}, la misma que pertenece al área de ${seccion.area.descripcion}. Por favor, llene los campos a continuación...`;
    this.addNewPolForm.get('seccion')?.setValue(seccion.id_seccion);
    this.showNewPolModal = !this.showNewPolModal;
  }

  toggleCreatePolModalClose() {
    this.addNewPolForm.reset(this.resetPolInformation);
    this.showNewPolModal = false;
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
      return 'bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300';
    } else {
      return 'bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300';
    }
  }

  get resetAreaInformation() {
    return {
      descripcion: '',
      isAvailible: true,
    };
  }

  get resetSeccionInformation() {
    return {
      area_trabajo: '',
      descripcion: '',
      isAvailible: true,
    };
  }

  get resetPolInformation() {
    return {
      seccion: '',
      descripcion: '',
      isAvailible: true,
    };
  }
}
