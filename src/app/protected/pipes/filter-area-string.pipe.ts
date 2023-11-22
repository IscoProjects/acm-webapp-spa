import { Pipe, PipeTransform } from '@angular/core';
import { Area } from '../prointerfaces/api.interface';

@Pipe({
  name: 'filterAreaString',
})
export class FilterAreaStringPipe implements PipeTransform {
  transform(value: Area[], searchString: string) {
    if (!searchString || searchString === '') {
      return value;
    }
    return value.filter((area) =>
      `${area.descripcion}`
        .toLowerCase()
        .includes(searchString.toLowerCase())
    );
  }
}
