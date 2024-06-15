import { Component, ViewChild, inject } from '@angular/core';
import { AlertController, IonicModule, IonModal, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CronometroComponent } from '../components/cronometro/cronometro.component';
import { RouterLink } from "@angular/router";
import { AuthService,  PatientService, ProgramPatientService } from '../services';
import { HttpClient } from '@angular/common/http';
import { AuthHTTP } from '../repos';
import { PatientHTTP } from '../repos';
import { ComponentsModule } from '../pipes/components.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SlicePipe } from "@angular/common";

import { ProgramPatientHTTP } from '../repos';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        CronometroComponent,
        RouterLink,
        ComponentsModule,
        TranslateModule,
        SlicePipe
    ],
    providers: [
        HttpClient,
        AuthService,
        AuthHTTP,
        PatientService,
        PatientHTTP,
        ProgramPatientService,
        ProgramPatientHTTP
    ],
})
export class Tab1Page {

}
