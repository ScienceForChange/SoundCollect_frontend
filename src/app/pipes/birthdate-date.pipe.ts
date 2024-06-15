import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';
@Pipe({
  name: 'birthdateDate'
})
export class BirthdateDatePipe implements PipeTransform {
  constructor() {}
  transform(value: number): string {
    return  moment(value * 1000).format('LL');
  }
}
