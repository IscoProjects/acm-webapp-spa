import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nullPipe',
})
export class NullPipe implements PipeTransform {
  transform(value: any, message: string = 'S/Inf.'): string {
    return value ? value : message;
  }
}
