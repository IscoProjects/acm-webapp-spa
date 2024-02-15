import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'birthday',
})
export class BirthdayPipe implements PipeTransform {
  transform(fechaNacimiento: Date): string {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return `${edad} años`;
  }
}
