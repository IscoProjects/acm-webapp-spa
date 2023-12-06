import { Component, Input, OnInit } from '@angular/core';
import { PaginationInstance } from 'ngx-pagination';
import { Loading, Report } from 'notiflix';
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
