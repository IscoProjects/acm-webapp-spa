import { Pipe, PipeTransform } from '@angular/core';
import { EstacionTrabajo } from '../prointerfaces/api.interface';

@Pipe({
  name: 'filterPolivalenteString',
})
export class FilterPolivalenteStringPipe implements PipeTransform {
  transform(value: EstacionTrabajo[], searchString: string) {
    if (!searchString || searchString === '') {
      return value;
    }
    return value.filter((polivalente) =>
      `${polivalente.descripcion}`
        .toLowerCase()
        .includes(searchString.toLowerCase())
    );
  }
}
