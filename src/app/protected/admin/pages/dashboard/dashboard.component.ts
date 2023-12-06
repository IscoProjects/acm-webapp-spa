import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  AvgTiempoEspera,
  AvgTiempoEsperaPorSeccion,
  Usuario,
} from 'src/app/protected/prointerfaces/api.interface';
import { Loading, Report } from 'notiflix';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';
import { AgendamientoService } from 'src/app/protected/proservices/agendamiento.service';
import { Chart } from 'chart.js/auto';
import { SeccionService } from 'src/app/protected/proservices/seccion.service';
import { NgSelectConfig } from '@ng-select/ng-select';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  get currentProfesional() {
    return this.authService.currentUser();
  }

  currentUserInformation: Usuario = Object.create([]);
  usersList: Usuario[] = [];
  dateNow = new Date();
  formatedDateNow: string = this.dateNow.toISOString().split('T')[0];
  avgTiempoEsperaUsersData: AvgTiempoEspera[] = [];
  avgTiempoEsperaSeccions: AvgTiempoEsperaPorSeccion[] = [];
  avgTiempoEsperaUser: AvgTiempoEspera[] = [];
  numberDays: number = 7;

  //User Chart
  userSelectedId: string | null = null;
  showUserChart: boolean = false;

  //chart.js
  generalChart!: Chart;
  seccionChart!: Chart;
  userChart!: Chart;

  constructor(
    private authService: AuthService,
    private userService: UsuarioService,
    private agendaService: AgendamientoService,
    private seccionService: SeccionService,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.ngSelectConfig.appendTo = 'body';
  }

  ngOnInit(): void {
    Loading.pulse('Obteniendo información');

    forkJoin([
      this.userService.searchUserInfoInApi(this.currentProfesional!.id_usuario),
      this.agendaService.getAvgWaitingTime(this.numberDays),
      this.seccionService.getAvgWaitingTimeBySection(this.numberDays),
      this.userService.searchAllUsersInfoInApi(),
    ]).subscribe({
      next: ([currentUser, avgUsers, avgSections, listUsers]) => {
        this.currentUserInformation = currentUser;
        this.avgTiempoEsperaUsersData = avgUsers;
        this.avgTiempoEsperaSeccions = avgSections;
        this.usersList = listUsers;
        this.createGeneralChartAVG();
        this.createSeccionChartAVG();
        Loading.remove();
      },
      error: (e) => {
        this.currentUserInformation = Object.create([]);
        this.avgTiempoEsperaUsersData = [];
        this.avgTiempoEsperaSeccions = [];
        this.usersList = [];
        Loading.remove();
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
  }

  getUserAvgData() {
    const user = this.userSelectedId;
    if (user) {
      this.userService.getAvgWaitingTimeByUser(user).subscribe({
        next: (data) => {
          this.avgTiempoEsperaUser = data;
          this.showUserChart = true;
        },
        error: (err) => {
          this.avgTiempoEsperaUser = [];
        },
        complete: () => {
          this.createUserChartAVG();
        },
      });
    }
  }

  createGeneralChartAVG() {
    const labels = this.avgTiempoEsperaUsersData.map(
      (item) => item.dia.split('T')[0]
    );
    const data = this.avgTiempoEsperaUsersData.map(
      (item) => item.tiempo_espera_promedio
    );

    this.generalChart = new Chart('avgGeneralLineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Tiempo Promedio',
            data: data,
            borderColor: 'rgb(6 182 212)',
            fill: false,
            tension: 0.1,
            borderWidth: 1.5,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'x',
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Tiempo (minutos)',
            },
          },
        },
      },
    });
  }

  createSeccionChartAVG() {
    const labels = this.avgTiempoEsperaSeccions.map((item) => item.seccion);
    const data = this.avgTiempoEsperaSeccions.map(
      (item) => item.tiempo_espera_promedio
    );

    this.seccionChart = new Chart('avgSeccionsLineChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Tiempo Promedio',
            data: data,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 205, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(201, 203, 207, 0.2)',
            ],
            borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)',
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'x',
        scales: {
          x: {
            title: {
              display: true,
              text: 'Sección',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Tiempo (minutos)',
            },
          },
        },
      },
    });
  }

  createUserChartAVG() {
    const labels = this.avgTiempoEsperaUser.map(
      (item) => item.dia.split('T')[0]
    );
    const data = this.avgTiempoEsperaUser.map(
      (item) => item.tiempo_espera_promedio
    );

    if (this.userChart) {
      this.userChart.destroy();
    }

    this.userChart = new Chart('avgUserLineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Tiempo de espera',
            data: data,
            borderColor: 'rgb(6 182 212)',
            fill: false,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'x',
        scales: {
          x: {
            title: {
              display: true,
              text: 'Fecha',
              color: 'rgb(59 130 246)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Promedio en minutos',
              color: 'rgb(59 130 246)',
            },
          },
        },
      },
    });
  }
}
