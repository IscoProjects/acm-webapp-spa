import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Confirm, Loading, Notify, Report } from 'notiflix';
import { Barrio } from 'src/app/protected/models/barrio.model';
import { Canton } from 'src/app/protected/models/cantones.model';
import { Parroquia } from 'src/app/protected/models/parroquias.model';
import { Provincia } from 'src/app/protected/models/provincia.model';
import { Paciente } from 'src/app/protected/prointerfaces/api.interface';
import { PacienteService } from 'src/app/protected/proservices/paciente.service';
import { ProvinciaService } from 'src/app/protected/proservices/provincia.service';

@Component({
  selector: 'app-update-paciente',
  templateUrl: './update-paciente.component.html',
  styleUrls: ['./update-paciente.component.css'],
})
export class UpdatePacienteComponent {
  date_now: Date = new Date();
  searchPatientString: string = '';
  isPatientFound: boolean = false;
  patientInformation: Paciente = Object.create([]);

  updatePatientForm: FormGroup = this.fb.group({
    pac_cedula: [
      '',
      [
        Validators.required,
        Validators.pattern('[0-9]+'),
        Validators.minLength(8),
        Validators.maxLength(12),
      ],
    ],
    pac_nombre: ['', [Validators.required, Validators.minLength(3)]],
    pac_apellido: ['', [Validators.required, Validators.minLength(3)]],
    pac_sexo: ['', [Validators.required]],
    pac_fecha_nac: ['', [Validators.required]],
    pac_telefono: [
      '',
      [Validators.pattern('[0-9]+'), Validators.maxLength(12)],
    ],
    pac_provincia: ['', [Validators.required, Validators.minLength(3)]],
    pac_canton: ['', [Validators.required, Validators.minLength(3)]],
    pac_parroquia: ['', [Validators.required, Validators.minLength(3)]],
    pac_direccion: ['', [Validators.required, Validators.minLength(3)]],
    pac_gprioritario: [[]],
    pac_ref_person: ['', [Validators.required, Validators.minLength(3)]],
    pac_ref_parentesco: ['', [Validators.required, Validators.minLength(3)]],
    pac_ref_telefono: [
      '',
      [Validators.pattern('[0-9]+'), Validators.maxLength(12)],
    ],
  });

  //Grupos prioritarios
  listOfGroups: string[] = [
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
    'Niño menor a dos años',
    'Adulto mayor',
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
    private pacienteService: PacienteService,
    private fb: FormBuilder,
    private provinciaService: ProvinciaService,
    private ngSelectConfig: NgSelectConfig
  ) {
    this.provincias = this.provinciaService.getProvincias();
    this.ngSelectConfig.appendTo = 'body';
  }

  searchPatientInfo() {
    if (this.searchPatientString) {
      Loading.dots('Obteniendo información');
      this.pacienteService
        .searchPatientInApi(this.searchPatientString)
        .subscribe({
          next: (resp) => {
            this.patientInformation = resp;
            this.isPatientFound = true;
            this.updatePatientForm.patchValue(this.patientInformation);
            this.defaultUbicationInformation();
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

  updatePatientInfo() {
    Confirm.show(
      'Actualización',
      `Guardar cambios para el paciente: ${this.patientInformation.pac_cedula}`,
      'Confirmar',
      'Cancelar',
      () => {
        this.pacienteService
          .updatePatientInApi(
            this.patientInformation.id_paciente,
            this.updatePatientForm.value
          )
          .subscribe({
            next: (resp) => {
              Notify.success('Actualización exitosa');
              this.searchPatientString = '';
              this.isPatientFound = false;
              this.patientInformation = Object.create([]);
              this.updatePatientForm.reset(this.resetPatitentInformation);
            },
            error: (e) => {
              this.searchPatientString = '';
              this.isPatientFound = false;
              this.patientInformation = Object.create([]);
              this.updatePatientForm.reset(this.resetPatitentInformation);
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

  onProvinciaChange() {
    const selectedProvinciaNombre =
      this.updatePatientForm.get('pac_provincia')?.value;

    const selectedProvincia = this.provincias.find(
      (provincia) => provincia.nombre === selectedProvinciaNombre
    );

    if (selectedProvincia) {
      this.cantones = this.provinciaService.getCantonesByProvinciaId(
        selectedProvincia.id
      );
      this.parroquias = [];
      this.updatePatientForm.get('pac_canton')?.reset();
      this.updatePatientForm.get('pac_parroquia')?.reset();
      this.updatePatientForm.get('pac_direccion')?.reset();
    }
  }

  onCantonChange() {
    const selectedCantonNombre =
      this.updatePatientForm.get('pac_canton')?.value;

    const selectedCanton = this.cantones.find(
      (canton) => canton.nombre === selectedCantonNombre
    );

    if (selectedCanton) {
      this.parroquias = this.provinciaService.getParroquiasByCantonId(
        selectedCanton.id
      );

      this.barrios = [];
      this.updatePatientForm.get('pac_parroquia')?.reset();
      this.updatePatientForm.get('pac_direccion')?.reset();
    }
  }

  onParroquiaChange() {
    const selectedParroquiaNombre =
      this.updatePatientForm.get('pac_parroquia')?.value;

    const selectedParroquia = this.parroquias.find(
      (parroquia) => parroquia.nombre === selectedParroquiaNombre
    );

    if (selectedParroquia) {
      this.barrios = this.provinciaService.getBarriosByParroquiaId(
        selectedParroquia.id
      );
      this.updatePatientForm.get('pac_direccion')?.reset();
    }
  }

  defaultUbicationInformation() {
    const defaultProvincia = this.updatePatientForm.get('pac_provincia')?.value;
    const defaultCanton = this.updatePatientForm.get('pac_canton')?.value;
    const defaulParroquia = this.updatePatientForm.get('pac_parroquia')?.value;

    const selectedProvincia = this.provincias.find(
      (provincia) => provincia.nombre === defaultProvincia
    );
    if (selectedProvincia) {
      this.cantones = this.provinciaService.getCantonesByProvinciaId(
        selectedProvincia.id
      );
    }
    const selectedCanton = this.cantones.find(
      (canton) => canton.nombre === defaultCanton
    );

    if (selectedCanton) {
      this.parroquias = this.provinciaService.getParroquiasByCantonId(
        selectedCanton.id
      );
    }
    const selectedParroquia = this.parroquias.find(
      (parroquia) => parroquia.nombre === defaulParroquia
    );

    if (selectedParroquia) {
      this.barrios = this.provinciaService.getBarriosByParroquiaId(
        selectedParroquia.id
      );
    }
  }

  get canUpdate(): boolean {
    return this.updatePatientForm.valid && this.updatePatientForm.dirty;
  }

  get resetPatitentInformation() {
    return {
      id_paciente: '',
      pac_cedula: '',
      pac_nombre: '',
      pac_apellido: '',
      pac_sexo: '',
      pac_fecha_nac: '',
      pac_provincia: '',
      pac_canton: '',
      pac_parroquia: '',
      pac_direccion: '',
      pac_telefono: '',
      pac_gprioritario: '',
      pac_ref_person: '',
      pac_ref_parentesco: '',
      pac_ref_telefono: '',
    };
  }
}
