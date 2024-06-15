import { NgModule } from '@angular/core';
import { BirthdateDatePipe } from './birthdate-date.pipe';
import { FormatDatePipe } from './format-date.pipe';
import { FormatEpochPipe } from './format-epoch.pipe';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
@NgModule({
  declarations: [BirthdateDatePipe, FormatDatePipe, FormatEpochPipe],
  exports: [
    BirthdateDatePipe, FormatDatePipe, FormatEpochPipe
  ],
  providers: [AndroidPermissions]
})
export class ComponentsModule { }
