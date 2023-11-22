import { Pipe, PipeTransform } from '@angular/core';
import { Seccion } from '../prointerfaces/api.interface';

@Pipe({
  name: 'filterSeccionString',
})
export class FilterSeccionStringPipe implements PipeTransform {
  transform(value: Seccion[], searchString: string) {
    if (!searchString || searchString === '') {
      return value;
    }
    return value.filter((seccion) =>
      `${seccion.descripcion}`
        .toLowerCase()
        .includes(searchString.toLowerCase())
    );
  }
}
