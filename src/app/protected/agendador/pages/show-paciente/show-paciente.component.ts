import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Loading, Report } from 'notiflix';
import { switchMap } from 'rxjs';
import { Paciente } from 'src/app/protected/prointerfaces/api.interface';
import { PacienteService } from 'src/app/protected/proservices/paciente.service';

@Component({
  selector: 'app-show-paciente',
  templateUrl: './show-paciente.component.html',
  styleUrls: ['./show-paciente.component.css'],
})
export class ShowPacienteComponent implements OnInit {
  //Paginacion
  public searchPatientString: string = '';
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

  //data
  patientsInformation: Paciente[] = [];

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.pacienteService
      .searchAllPatientInApi()
      .pipe(
        switchMap(() => {
          Loading.dots('Obteniendo información');
          return this.pacienteService.searchAllPatientInApi();
        })
      )
      .subscribe({
        next: (resp) => {
          Loading.remove();
          this.patientsInformation = resp;
        },
        error: (e) => {
          this.patientsInformation = [];
          Loading.remove();
          Report.failure(
            '¡Ups! Algo ha salido mal',
            `${e.error.message}`,
            'Volver'
          );
        },
      });
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
}
