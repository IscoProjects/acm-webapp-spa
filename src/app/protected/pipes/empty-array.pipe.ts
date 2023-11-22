import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyArray',
})
export class EmptyArrayPipe implements PipeTransform {
  transform(array: string[]): string {
    if (!array || array.length === 0) {
      return 'Ninguno';
    }

    return array.join(', ');
  }
}
