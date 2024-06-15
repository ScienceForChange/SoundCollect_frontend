import { NgModule } from '@angular/core';
import {BirthdateDatePipe} from './birthdate-date.pipe';
import {FormatDatePipe} from './format-date.pipe';
import {FormatEpochPipe} from './format-epoch.pipe';
@NgModule({
  declarations: [BirthdateDatePipe, FormatDatePipe, FormatEpochPipe],
  exports: [
    BirthdateDatePipe, FormatDatePipe, FormatEpochPipe
    ]
})
export class ComponentsModule { }
