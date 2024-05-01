import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Confirm, Notify, Report } from 'notiflix';
import { Barrio } from 'src/app/protected/models/barrio.model';
import { Canton } from 'src/app/protected/models/cantones.model';
import { Parroquia } from 'src/app/protected/models/parroquias.model';
import { Provincia } from 'src/app/protected/models/provincia.model';
import { PacienteService } from 'src/app/protected/proservices/paciente.service';
import { ProvinciaService } from 'src/app/protected/proservices/provincia.service';

@Component({
  selector: 'app-create-paciente',
  templateUrl: './create-paciente.component.html',
  styleUrls: ['./create-paciente.component.css'],
})
export class CreatePacienteComponent {
  date_now: Date = new Date();

  add_patient: FormGroup = this.fb.group({
    pac_cedula: [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(12),
      ],
    ],
    pac_nombre: ['', [Validators.required, Validators.minLength(3)]],
    pac_apellido: ['', [Validators.required, Validators.minLength(3)]],
    pac_sexo: [, [Validators.required]],
    pac_fecha_nac: ['', [Validators.required]],
    pac_telefono: [
      '',
      [Validators.pattern('[0-9]+'), Validators.maxLength(12)],
    ],
    pac_provincia: [
      'Chimborazo',
      [Validators.required, Validators.minLength(3)],
    ],
    pac_canton: ['Chambo', [Validators.required, Validators.minLength(3)]],
    pac_parroquia: ['Chambo', [Validators.required, Validators.minLength(3)]],
    pac_direccion: [, [Validators.required, Validators.minLength(3)]],
    pac_gprioritario: [[]],
    pac_ref_person: ['', [Validators.required, Validators.minLength(3)]],
    pac_ref_parentesco: [, [Validators.required, Validators.minLength(3)]],
    pac_ref_telefono: [
      '',
      [Validators.pattern('[0-9]+'), Validators.maxLength(12)],
    ],
  });

  //Grupos prioritarios
  listOfGroups: string[] = [
    'Ninguno',
    'Mujer embarazada',
    'Niño menor de 5 años con malnutrición',
    'Niño con esquema de vacunación incompleto',
    'Discapacidad',
    'Problemas de salud mental',
    'Privado de libertad',
    'Enfermedad Crónica',
    'Enfermedad crónica no transmisible',
    'Tuberculosis',
    'VIH',
    'Víctima de violencia',
  ];

  //Parentesco
  listOfKinship: string[] = [
    'Padres',
    'Hijo/a',
    'Esposo/a',
    'Hermano/a',
    'Abuelo/a',
    'Tío/a',
    'Nieto/a',
    'Sobrino/a',
    'Cuñado/a',
    'Vecino/a',
    'Otro',
  ];

  //Genero
  genre: string[] = ['Masculino', 'Femenino', 'Otro'];

  // Provincias
  provincias: Provincia[] = [];
  cantones: Canton[] = [];
  parroquias: Parroquia[] = [];
  barrios: Barrio[] = [];

  constructor(
    private fb: FormBuilder,
    private pacienteService: PacienteService,
    private provinciaService: ProvinciaService,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.provincias = this.provinciaService.getProvincias();
    this.cantones = this.provinciaService.getCantonesByProvinciaId(6);
    this.parroquias = this.provinciaService.getParroquiasByCantonId(46);
    this.barrios = this.provinciaService.getBarriosByParroquiaId(307);
    this.ngSelectConfig.appendTo = 'body';
  }

  register_patient_new() {
    this.checkPatientAge();

    Confirm.show(
      'Agregar Paciente',
      '¿Desea registrar un nuevo paciente?',
      'Confirmar',
      'Cancelar',
      () => {
        this.pacienteService
          .addNewPatientInApi(this.add_patient.value)
          .subscribe({
            next: (resp) => {
              this.add_patient.reset(this.resetPatitentInformation);
              Notify.success('Paciente registrado exitosamente');
            },
            error: (e) => {
              this.add_patient.reset(this.resetPatitentInformation);
              Report.failure(
                '¡Ups! Algo ha salido mal',
                `${e.error.message}`,
                'Volver'
              );
            },
          });
      },
      () => {
        Notify.failure('Paciente no Registrado');
      }
    );
  }

  get resetPatitentInformation() {
    return {
      id_paciente: '',
      pac_cedula: '',
      pac_nombre: '',
      pac_apellido: '',
      pac_sexo: null,
      pac_fecha_nac: '',
      pac_provincia: 'Chimborazo',
      pac_canton: 'Chambo',
      pac_parroquia: 'Chambo',
      pac_direccion: null,
      pac_telefono: '',
      pac_gprioritario: '',
      pac_ref_person: '',
      pac_ref_parentesco: null,
      pac_ref_telefono: '',
    };
  }

  checkPatientAge() {
    const CHILD_AGE_LIMIT = 2;
    const SENIOR_AGE_LIMIT = 65;
    const childrenAge = 'Niño menor a dos años';
    const seniorAge = 'Adulto mayor';

    const today = new Date();
    const patientDate = this.add_patient.get('pac_fecha_nac')?.value;
    const pacGprioControl = this.add_patient.get('pac_gprioritario');
    let pacGprioSelection = pacGprioControl?.value || [];

    if (!patientDate) {
      return;
    }

    const birthDate = new Date(patientDate);
    const age =
      today.getFullYear() -
      birthDate.getFullYear() -
      (today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
        ? 1
        : 0);

    if (age < CHILD_AGE_LIMIT) {
      pacGprioSelection = this.updateSelection(pacGprioSelection, childrenAge);
      pacGprioControl?.setValue(pacGprioSelection);
    } else if (age >= SENIOR_AGE_LIMIT) {
      pacGprioSelection = this.updateSelection(pacGprioSelection, seniorAge);
      pacGprioControl?.setValue(pacGprioSelection);
    }
  }

  updateSelection(selectionArray: string[], ageCategory: string): string[] {
    if (!selectionArray.includes(ageCategory)) {
      selectionArray.push(ageCategory);
    }
    return selectionArray;
  }

  onProvinciaChange() {
    const selectedProvinciaNombre =
      this.add_patient.get('pac_provincia')?.value;

    const selectedProvincia = this.provincias.find(
      (provincia) => provincia.nombre === selectedProvinciaNombre
    );

    if (selectedProvincia) {

      this.cantones = this.provinciaService.getCantonesByProvinciaId(
        selectedProvincia.id
      );
      this.parroquias = [];
      this.add_patient.get('pac_canton')?.reset();
      this.add_patient.get('pac_parroquia')?.reset();
      this.add_patient.get('pac_direccion')?.reset();
    }
  }

  onCantonChange() {
    const selectedCantonNombre = this.add_patient.get('pac_canton')?.value;

    const selectedCanton = this.cantones.find(
      (canton) => canton.nombre === selectedCantonNombre
    );

    if (selectedCanton) {

      this.parroquias = this.provinciaService.getParroquiasByCantonId(
        selectedCanton.id
      );

      this.barrios = [];
      this.add_patient.get('pac_parroquia')?.reset();
      this.add_patient.get('pac_direccion')?.reset();
    }
  }

  onParroquiaChange() {
    const selectedParroquiaNombre =
      this.add_patient.get('pac_parroquia')?.value;

    const selectedParroquia = this.parroquias.find(
      (parroquia) => parroquia.nombre === selectedParroquiaNombre
    );

    if (selectedParroquia) {
      this.barrios = this.provinciaService.getBarriosByParroquiaId(
        selectedParroquia.id
      );
      this.add_patient.get('pac_direccion')?.reset();
    }
  }
}
