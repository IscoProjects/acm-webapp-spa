import { Pipe, PipeTransform } from '@angular/core';
import { Paciente } from '../prointerfaces/api.interface';

@Pipe({
  name: 'filterPacienteString'
})
export class FilterPacienteStringPipe implements PipeTransform {

  transform(value: Paciente[], searchString: string) {
    if (!searchString || searchString === '') {
      return value;
    }
    return value.filter((item) =>
      `${item.pac_apellido} ${item.pac_nombre}`
        .toLowerCase()
        .includes(searchString.toLowerCase())
    );
  }

}
