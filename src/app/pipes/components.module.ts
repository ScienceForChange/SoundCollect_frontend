import { NgModule } from '@angular/core';
import { BirthdateDatePipe } from './birthdate-date.pipe';
import { FormatDatePipe } from './format-date.pipe';
import { FormatEpochPipe } from './format-epoch.pipe';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { ParseFloatPipe } from './format-str2float.pipe';
@NgModule({
  declarations: [BirthdateDatePipe, FormatDatePipe, FormatEpochPipe, ParseFloatPipe],
  exports: [
    BirthdateDatePipe, FormatDatePipe, FormatEpochPipe, ParseFloatPipe
  ],
  providers: [AndroidPermissions]
})
export class ComponentsModule { }
