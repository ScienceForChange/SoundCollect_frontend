import { Pipe, PipeTransform } from '@angular/core';
import {AuthService} from '../services/auth.service';
import * as moment from 'moment';

@Pipe({
  name: 'formatEpoch'
})
export class FormatEpochPipe implements PipeTransform {

  constructor(private authService: AuthService) {
  }

  transform(value: number): string {
    const ll = moment(value * 1000).utc().locale('es').format('dddd DD');
    const aux = ll.split(' ');
    return `${aux[0].charAt(0).toUpperCase()}${aux[0].substring(1)} ${aux[1]}`;
  }

}
