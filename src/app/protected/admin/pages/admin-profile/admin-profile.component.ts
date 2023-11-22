import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Confirm, Notify, Report } from 'notiflix';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  EstacionTrabajo,
  Usuario,
} from 'src/app/protected/prointerfaces/api.interface';
import { UsuarioService } from 'src/app/protected/proservices/usuario.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css'],
})
export class AdminProfileComponent {}
