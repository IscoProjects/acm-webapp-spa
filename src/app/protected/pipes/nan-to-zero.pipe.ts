import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nanToZero',
})
export class NanToZeroPipe implements PipeTransform {
  transform(value: any): any {
    if (isNaN(value)) {
      return '0';
    }

    return value;
  }
}
