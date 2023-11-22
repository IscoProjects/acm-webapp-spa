import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'consultaStatus',
})
export class ConsultaStatusPipe implements PipeTransform {
  transform(estado: boolean): string {
    if (estado) {
      return 'Registrado';
    } else {
      return 'Pendiente';
    }
  }
}
