import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  timezone = 'America/Guayaquil';

  constructor() {}

  getCurrentDateTime(): string {
    return moment().tz(this.timezone).format();
  }

  getCurrentDate(): string {
    return moment().tz(this.timezone).format('YYYY-MM-DD');
  }

  getCurrentTime(): string {
    return moment().tz(this.timezone).format('HH:mm:ss');
  }
}
