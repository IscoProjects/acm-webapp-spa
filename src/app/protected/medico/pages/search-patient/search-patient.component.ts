import { Component, Input } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Loading, Report } from 'notiflix';
import { Paciente } from 'src/app/protected/prointerfaces/api.interface';
import { PacienteService } from 'src/app/protected/proservices/paciente.service';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css'],
})
export class SearchPatientComponent {
  @Input('data') patientInformation: Paciente = Object.create([]);

  searchPatientString: string = '';
  isPatientFound: boolean = false;
  patientNumerOfDates: number = 0;

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

  constructor(private pacienteService: PacienteService) {}

  searchPatientInformation() {
    if (this.searchPatientString) {
      Loading.standard('Obteniendo información');
      this.pacienteService
        .searchPatientInApi(this.searchPatientString)
        .subscribe({
          next: (resp) => {
            this.patientInformation = resp;
            this.patientNumerOfDates =
              this.patientInformation.agendamiento.length;
            this.isPatientFound = true;
            Loading.remove();
          },
          error: (e) => {
            this.isPatientFound = false;
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

  getStatusClass(estado: string): string {
    switch (estado) {
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
}
