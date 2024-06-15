import { Component, NO_ERRORS_SCHEMA, ViewChild, inject } from '@angular/core';
import { AlertController, IonModal, IonicModule, NavController } from '@ionic/angular';
import { AuthService, CommonService, PatientService, ProgramPatientService } from '../services';
import { HttpClient } from '@angular/common/http';
import { AuthHTTP } from '../repos/auth-repo-http';
import { PatientHTTP } from '../repos/patient-repo-http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, SlicePipe } from "@angular/common";
import * as moment from 'moment';
import { ProgramPatientHTTP } from '../repos';
import { ComponentsModule } from '../pipes/components.module';
import { RouterLink } from '@angular/router';4
import { UserService } from '../services/user-service';
import { UserHTTP } from '../repos/user-repo-http';4

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, RouterLink, SlicePipe, ComponentsModule,],
  providers: [HttpClient, AuthService, AuthHTTP, UserService, UserHTTP, PatientService, PatientHTTP, ProgramPatientService, ProgramPatientHTTP],
})
export class Tab4Page {

}
