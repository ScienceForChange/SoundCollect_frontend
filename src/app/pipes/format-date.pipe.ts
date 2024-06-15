import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';
import {AuthService} from '../services/auth.service';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  constructor() {}
  transform(value: number): string {
    const ll = moment(value * 1000).format('HH:mm a,dddd');
    const myDate = ll.split(',');
    const aux = myDate[0].split(' ');
    return `${myDate[0]}, ${myDate[1].charAt(0).toUpperCase()}${myDate[1].substring(1)}`;
  }

}
