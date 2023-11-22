export interface Area {
  id_area: string;
  descripcion: string;
  isAvailible: boolean;
  seccion: Seccion[];
}

export interface Seccion {
  id_seccion: string;
  descripcion: string;
  isAvailible: boolean;
  estacion_trabajo: EstacionTrabajo[];
  area: Area;
}

export interface EstacionTrabajo {
  id_estacion: string;
  descripcion: string;
  isAvailible: boolean;
  usuario: Usuario[];
  seccion: Seccion;
}

export interface Usuario {
  id_usuario: string;
  us_cedula: string;
  us_nombres: string;
  us_apellidos: string;
  us_isActive: boolean;
  us_carrera: string;
  us_telefono: string;
  us_fecha_nac: Date;
  us_sexo: string;
  us_user: string;
  us_role: string;
  estacion_trabajo: EstacionTrabajo;
  agendamiento?: Agendamiento[];
  numTurnos?: number;
}

export interface Agendamiento {
  id_agendamiento: string;
  nro_agenda: number;
  canal_agenda: string;
  detalle_agenda: string;
  fecha_agenda: Date;
  fecha_consulta: string;
  hora_consulta: string;
  duracion_consulta: number;
  estado_agenda: boolean;
  pac_asistencia: boolean;
  pac_afiliacion: string;
  observaciones: string;
  agendado_por: string;
  usuario?: Usuario;
  paciente?: Paciente;
  consulta?: Consulta;
}

export interface Paciente {
  id_paciente: string;
  pac_cedula: string;
  pac_nombre: string;
  pac_apellido: string;
  pac_sexo: string;
  pac_fecha_nac: Date;
  pac_telefono: string;
  pac_provincia: string;
  pac_canton: string;
  pac_parroquia: string;
  pac_direccion: string;
  pac_gprioritario: string[];
  pac_ref_person: string;
  pac_ref_parentesco: string;
  pac_ref_telefono: string;
  agendamiento: Agendamiento[];
}

export interface SeccionMetadata {
  id_seccion: string;
  descripcion: string;
  isAvailible: boolean;
  estacion_trabajo: EstacionTrabajo[];
  area: Area;
  numPolivalentes: number;
  dailyCapacity: number;
  totalCapacityThreeMonths: number;
  appointmentNumberThreeMonths: number;
  appointmentFilledPercentageThreeMonths: number;
  freeAppointmentNumberThreeMonths: number;
  freeAppointmentPercentageThreeMonths: number;
}

export interface EventosCalendar {
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
  description?: string;
}

export interface Eventos {
  paciente: string;
  start: string;
  end: string;
  duracion_consulta: number;
}

export interface userInformation {
  us_carrera: string;
  us_telefono: string;
}

export interface userAccount {
  us_user: string;
  us_password: string;
}

export interface Consulta {
  id_consulta: string;
  med_responsable: string;
  fecha: Date;
  hora_registro: string;
  tiempo_espera: number;
  observaciones?: string;
}

export interface UserAssignment {
  estacion_trabajo: string;
}

export interface userState {
  us_isActive: boolean;
}

export interface areaState {
  isAvailible: boolean;
}

export interface seccionState {
  isAvailible: boolean;
}

export interface polState {
  isAvailible: boolean;
}

export interface AvgTiempoEspera {
  dia: string;
  tiempo_espera_promedio: number;
}

export interface AvgTiempoEsperaPorSeccion {
  seccion: string;
  tiempo_espera_promedio: number;
}
