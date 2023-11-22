import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nanToZero',
})
export class NanToZeroPipe implements PipeTransform {
  transform(value: any): any {
    // Verificar si el valor es NaN
    if (isNaN(value)) {
      return '0';
    }

    // Devolver el valor original si no es NaN
    return value;
  }
}
