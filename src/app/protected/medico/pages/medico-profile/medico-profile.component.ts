import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart } from 'chart.js/auto';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  AvgTiempoEspera,
  EstacionTrabajo,
  Usuario,
} from 'src/app/protected/prointerfaces/api.interface';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';

@Component({
  selector: 'app-medico-profile',
  templateUrl: './medico-profile.component.html',
  styleUrls: ['./medico-profile.component.css'],
})
export class MedicoProfileComponent {
  get currentProfesional() {
    return this.authService.currentUser();
  }

  userInformation: Usuario = Object.create([]);
  polInformation: EstacionTrabajo = Object.create([]);
  avgTiempoEsperaData: AvgTiempoEspera[] = [];
  numberDays: number = 7;

  showUserModal: boolean = false;
  showNicknameModal: boolean = false;
  showPasswordModal: boolean = false;

  //chart.js
  chart: any = [];

  // data password
  user_password = { us_password: '' };
  passwordRepeat: string = '';

  userInformationForm: FormGroup = this.fb.group({
    us_carrera: ['', [Validators.required, Validators.minLength(6)]],
    us_telefono: ['', Validators.minLength(6)],
  });

  userNicknameForm: FormGroup = this.fb.group({
    us_user: ['', Validators.required],
  });

  constructor(
    private authService: AuthService,
    private userService: UsuarioService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    Loading.circle('Cargando');
    this.searchUserInformation(this.currentProfesional!.id_usuario);
    this.getUserAvgData(this.currentProfesional!.id_usuario);
    Loading.remove();
  }

  searchUserInformation(id: string) {
    this.userService.searchUserInfoInApi(id).subscribe({
      next: (user) => {
        console.log(user);
        this.userInformation = user;
        this.polInformation = user.estacion_trabajo;

        this.userInformationForm
          .get('us_carrera')
          ?.setValue(this.userInformation.us_carrera);
        this.userInformationForm
          .get('us_telefono')
          ?.setValue(this.userInformation.us_telefono);
        this.userNicknameForm
          .get('us_user')
          ?.setValue(this.userInformation.us_user);
      },
      error: (e) => {
        this.userInformation = Object.create([]);
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
  }

  getUserAvgData(user: string) {
    this.userService.getAvgWaitingTimeByUser(user).subscribe({
      next: (data) => {
        this.avgTiempoEsperaData = data;
        this.createChartAVG();
        console.log(this.avgTiempoEsperaData);
      },
      error: (e) => {
        this.avgTiempoEsperaData = [];
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
  }

  updateUserInformation() {
    Confirm.show(
      'Actualización',
      `Guardar cambios para el usuario: ${this.userInformation.us_cedula}`,
      'Confirmar',
      'Cancelar',
      () => {
        this.userService
          .updateUserInformationInApi(
            this.currentProfesional!.id_usuario,
            this.userInformationForm.value
          )
          .subscribe({
            next: (resp) => {
              console.log(resp);
              Notify.success('Actualización exitosa');
              this.toggleUserModalClose();
              this.ngOnInit();
            },
            error: (e) => {
              this.toggleUserModalClose();
              Report.failure(
                '¡Ups! Algo ha salido mal',
                `${e.error.message}`,
                'Volver'
              );
            },
          });
      },
      () => {
        Notify.failure('Actualización cancelada');
      }
    );
  }

  updateUserNickname() {
    const newNicknameValue: string =
      this.userNicknameForm.get('us_user')?.value;
    this.userService.verifyUserNickname(newNicknameValue).subscribe({
      next: (response) => {
        console.log(response);
        Confirm.show(
          'Actualización',
          `Guardar nuevo usuario para <strong> ${this.userInformation.us_cedula}</strong>`,
          'Confirmar',
          'Cancelar',
          () => {
            this.userService
              .updateUserInformationInApi(
                this.currentProfesional!.id_usuario,
                this.userNicknameForm.value
              )
              .subscribe({
                next: (resp) => {
                  console.log(resp);
                  Notify.success('Actualización exitosa');
                  this.toggleNicknameModalClose();
                  this.ngOnInit();
                },
                error: (e) => {
                  this.toggleNicknameModalClose();
                  Report.failure(
                    '¡Ups! Algo ha salido mal',
                    `${e.error.message}`,
                    'Volver'
                  );
                },
              });
          },
          () => {
            Notify.failure('Actualización cancelada');
          }
        );
      },
      error: (e) => {
        console.log(e);
        Notify.failure('El usuario ya existe, ingrese uno nuevo.');
      },
    });
  }

  updateUserPassword() {
    if (this.user_password.us_password !== this.passwordRepeat) {
      Notify.warning('Las contraseñas no coinciden.');
    } else {
      console.log(this.user_password);
      Confirm.show(
        'Actualización',
        `Guardar nueva contraseña para <strong> ${this.userInformation.us_cedula}</strong>`,
        'Confirmar',
        'Cancelar',
        () => {
          this.userService
            .updateUserPasswordInApi(
              this.currentProfesional!.id_usuario,
              this.user_password
            )
            .subscribe({
              next: (resp) => {
                console.log(resp);
                Notify.success('Actualización exitosa');
                this.togglePasswordModalClose();
                this.ngOnInit();
              },
              error: (e) => {
                this.togglePasswordModalClose();
                Report.failure(
                  '¡Ups! Algo ha salido mal',
                  `${e.error.message}`,
                  'Volver'
                );
              },
            });
        },
        () => {
          Notify.failure('Actualización cancelada');
        }
      );
    }
  }

  toggleUserModal() {
    this.showUserModal = !this.showUserModal;
  }

  toggleUserModalClose() {
    this.userInformationForm.reset();
    this.userInformationForm
      .get('us_carrera')
      ?.setValue(this.userInformation.us_carrera);
    this.userInformationForm
      .get('us_telefono')
      ?.setValue(this.userInformation.us_telefono);
    this.showUserModal = false;
  }

  toggleNicknameModal() {
    this.showNicknameModal = !this.showNicknameModal;
  }

  toggleNicknameModalClose() {
    this.userNicknameForm.reset();
    this.userNicknameForm
      .get('us_user')
      ?.setValue(this.userInformation.us_user);
    this.showNicknameModal = false;
  }

  togglePasswordModal() {
    this.showPasswordModal = !this.showPasswordModal;
  }

  togglePasswordModalClose() {
    this.user_password.us_password = '';
    this.passwordRepeat = '';
    this.showPasswordModal = false;
  }

  createChartAVG() {
    console.log(this.avgTiempoEsperaData);

    const labels = this.avgTiempoEsperaData.map(
      (item) => item.dia.split('T')[0]
    );
    const data = this.avgTiempoEsperaData.map(
      (item) => item.tiempo_espera_promedio
    );
    console.log(labels);
    console.log(data);

    this.chart = new Chart('avgLineChart', {
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

  get canUpdateUser(): boolean {
    return this.userInformationForm.valid && this.userInformationForm.dirty;
  }

  get canUpdateNickname(): boolean {
    return (
      this.userNicknameForm.valid &&
      this.userNicknameForm.dirty &&
      this.userNicknameForm.get('us_user')?.value.length >= 6 &&
      this.userNicknameForm.get('us_user')?.value.length <= 24
    );
  }

  get canUpdatePassword(): boolean {
    const us_password = this.user_password.us_password;
    return (
      us_password.length >= 6 &&
      us_password.length <= 24 &&
      this.passwordRepeat.length >= 6 &&
      this.passwordRepeat.length <= 24 &&
      us_password === this.passwordRepeat
    );
  }
}
