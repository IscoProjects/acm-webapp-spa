import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assistanceStatus',
})
export class AssistanceStatusPipe implements PipeTransform {
  transform(estado: boolean): string {
    if (estado) {
      return 'Efectiva';
    } else {
      return 'No efectiva';
    }
  }
}
