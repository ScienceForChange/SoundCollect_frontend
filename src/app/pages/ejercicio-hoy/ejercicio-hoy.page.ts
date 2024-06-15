import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { NavigationExtras, Router, RouterLink } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService, CommonService, PatientService, ActivityService, ProgramPatientService } from '../../services';
import { AuthHTTP, PatientHTTP, ActivitytHTTP, ProgramPatientHTTP } from '../../repos';
import { IActivity, IUserData } from '../../models';

@Component({
    selector: 'app-ejercicio-hoy',
    templateUrl: './ejercicio-hoy.page.html',
    styleUrls: ['./ejercicio-hoy.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule],
    providers: [
        HttpClient,
        AuthService,
        AuthHTTP,
        PatientService,
        PatientHTTP,
        ActivitytHTTP,
        ActivityService,
        ProgramPatientService,
        ProgramPatientHTTP
    ]
})
export class EjercicioHoyPage implements OnInit {


    navController = inject(NavController);
    authService = inject(AuthService);
    common = inject(CommonService);
    router = inject(Router);
    programPatientService = inject(ProgramPatientService);
    urlBackend = environment.serverURL;
    contFinished = 0;
    step = 0;
    activity!: string;
    programPatient!: string;
    extras: NavigationExtras;
    exercises: IActivity[] = [];
    processing = true;
    userData: IUserData;
    programDescription: string = "";

    constructor() {
    }

    async ngOnInit() {
        this.extras = this.router.getCurrentNavigation()?.extras!;
        this.exercises = this.extras.state?.['exercises'];
        // @ts-ignore
        this.userData = await this.authService.getUser();
        this.processing = false;
        await this.getProgramDescription(this.exercises[0].activityProgramIri);
        console.log(this.exercises);

    }

    async goToTraining() {
        const params: NavigationExtras = {
            state: {
                exercises: this.exercises,
                userData: this.userData
            }
        };
        await this.navController.navigateRoot('entrenamiento', params);
    }

    goBack() {
        this.navController.back();
    }
    async getProgramDescription(program_id: string) {
        try {
            this.programDescription = await this.programPatientService.getProgramDescriptionByProgramId({ id: program_id });
        } catch (err) {
            this.programDescription = "No se pudo cargar la descripción del programa.";
        }
    }
}
