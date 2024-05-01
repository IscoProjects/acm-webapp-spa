import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Usuario } from 'src/app/protected/prointerfaces/api.interface';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
})
export class ManageUserComponent implements OnInit {
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

  //Data reset pss
  user_password = { us_password: '' };

  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    Loading.pulse('Obteniendo información');
    this.usuarioService.searchAllUsersMetadataFromApi().subscribe({
      next: (response) => {
        this.userInformation = response;
        Loading.remove();
      },
      error: (e) => {
        this.userInformation = [];
        Loading.remove();
        Report.failure(
          '¡Ups! Algo ha salido mal',
          `${e.error.message}`,
          'Volver'
        );
      },
    });
  }

  resetUserPassword(user: Usuario) {
    const id = user.id_usuario;
    const userName = user.us_apellidos + ' ' + user.us_apellidos;
    this.user_password.us_password = user.us_cedula;

    Confirm.show(
      'Reestablecer contraseña',
      `Se establecerá el número de CI como contraseña para el usuario: ${userName}`,
      'Aceptar',
      'Cancelar',
      () => {
        this.usuarioService
          .updateUserPasswordInApi(id, this.user_password)
          .subscribe({
            next: (resp) => {
              Notify.success('Actualización exitosa');
              this.user_password.us_password = '';
            },
            error: (e) => {
              this.user_password.us_password = '';
              Report.failure(
                '¡Ups! Algo ha salido mal',
                `${e.error.message}`,
                'Volver'
              );
            },
          });
      },
      () => {
        this.user_password.us_password = '';
        Notify.success('Actualización cancelada');
      }
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
      return 'bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300';
    } else {
      return 'bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300';
    }
  }
}
