import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UsuarioService } from '../../../proservices/usuario.service';
import { EstacionTrabajo, Usuario } from '../../../prointerfaces/api.interface';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  userInformation: Usuario = Object.create([]);
  polInformation: EstacionTrabajo = Object.create([]);
  showUserModal: boolean = false;
  showNicknameModal: boolean = false;
  showPasswordModal: boolean = false;

  // data password
  user_password = { us_password: '' };
  passwordRepeat: string = '';

  get currentProfesional() {
    return this.authService.currentUser();
  }

  adminInformationForm: FormGroup = this.fb.group({
    us_carrera: ['', [Validators.required, Validators.minLength(6)]],
    us_telefono: ['', Validators.minLength(6)],
  });

  adminNicknameForm: FormGroup = this.fb.group({
    us_user: ['', Validators.required],
  });

  constructor(
    private authService: AuthService,
    private userService: UsuarioService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.currentProfesional?.id_usuario) {
      Loading.dots('Obteniendo Información');
      this.searchUserInformation(this.currentProfesional.id_usuario);
    }
  }

  searchUserInformation(id: string) {
    this.userService.searchUserInfoInApi(id).subscribe({
      next: (user) => {
        this.userInformation = user;
        this.polInformation = user.estacion_trabajo;

        this.adminInformationForm
          .get('us_carrera')
          ?.setValue(this.userInformation.us_carrera);
        this.adminInformationForm
          .get('us_telefono')
          ?.setValue(this.userInformation.us_telefono);
        this.adminNicknameForm
          .get('us_user')
          ?.setValue(this.userInformation.us_user);

        Loading.remove();
      },
      error: (e) => {
        this.userInformation = Object.create([]);
        Loading.remove();
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
      `¿Guardar cambios para el usuario con CI: ${this.userInformation.us_cedula}?`,
      'Confirmar',
      'Cancelar',
      () => {
        this.userService
          .updateUserInformationInApi(
            this.currentProfesional!.id_usuario,
            this.adminInformationForm.value
          )
          .subscribe({
            next: (resp) => {
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
      this.adminNicknameForm.get('us_user')?.value;
    this.userService.verifyUserNickname(newNicknameValue).subscribe({
      next: (response) => {
        Confirm.show(
          'Actualización',
          `¿Guardar nuevo usuario para el profesional con CI: ${this.userInformation.us_cedula}?`,
          'Confirmar',
          'Cancelar',
          () => {
            this.userService
              .updateUserInformationInApi(
                this.currentProfesional!.id_usuario,
                this.adminNicknameForm.value
              )
              .subscribe({
                next: (resp) => {
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
        Notify.failure('El usuario ya existe, ingrese uno nuevo.');
      },
    });
  }

  updateUserPassword() {
    if (this.user_password.us_password !== this.passwordRepeat) {
      Notify.warning('Las contraseñas no coinciden.');
    } else {
      Confirm.show(
        'Actualización',
        `¿Guardar nueva contraseña para el usuario con CI: ${this.userInformation.us_cedula}?`,
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
    this.adminInformationForm.reset();
    this.adminInformationForm
      .get('us_carrera')
      ?.setValue(this.userInformation.us_carrera);
    this.adminInformationForm
      .get('us_telefono')
      ?.setValue(this.userInformation.us_telefono);
    this.showUserModal = false;
  }

  toggleNicknameModal() {
    this.showNicknameModal = !this.showNicknameModal;
  }

  toggleNicknameModalClose() {
    this.adminNicknameForm.reset();
    this.adminNicknameForm
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

  get canUpdateUser(): boolean {
    return this.adminInformationForm.valid && this.adminInformationForm.dirty;
  }

  get canUpdateNickname(): boolean {
    return (
      this.adminNicknameForm.valid &&
      this.adminNicknameForm.dirty &&
      this.adminNicknameForm.get('us_user')?.value.length >= 6 &&
      this.adminNicknameForm.get('us_user')?.value.length <= 24
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
