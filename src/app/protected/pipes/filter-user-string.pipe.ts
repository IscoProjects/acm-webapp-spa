import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../prointerfaces/api.interface';

@Pipe({
  name: 'filterUserString',
})
export class FilterUserStringPipe implements PipeTransform {
  transform(value: Usuario[], searchString: string) {
    if (!searchString || searchString === '') {
      return value;
    }
    return value.filter((item) =>
      `${item.us_apellidos} ${item.us_nombres}`
        .toLowerCase()
        .includes(searchString.toLowerCase())
    );
  }
}
