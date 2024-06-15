import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {IonicModule, ModalController, NavController} from '@ionic/angular';
import { Router, RouterLink } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthHTTP } from '../../repos/';
import { CommonService, AuthService } from '../../services';
import {environment} from '../../../environments/environment';
import {AlertsComponent} from "../../components/alerts/alerts.component";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        TranslateModule
    ],
    providers: [HttpClient, AuthService, AuthHTTP]
})
export class LoginPage implements OnInit {
   private modalController = inject(ModalController);
    navController = inject(NavController);
    authService = inject(AuthService);
    commonService = inject(CommonService);
    router = inject(Router);
    translate = inject(TranslateService);
    fb = inject(FormBuilder);

    loginFormGroup: FormGroup;
    myEye = 'eye';
    myType = 'password';
    credentials = {
        email: '',
        password: ''
    };
    appVersion=environment.appVersion;

    constructor() {
        this.loginFormGroup = this.fb.group({
            email: [this.credentials.email, [Validators.required, Validators.email]],
            password: [this.credentials.password, [Validators.required]],
        });
    }

    get email() {
        return this.loginFormGroup.get('email');
    }

    get password() {
        return this.loginFormGroup.get('password');
    }

    ngOnInit() {
    }

    changeImage() {
        if (this.myEye === 'eye') {
            this.myEye = 'eye_open';
            this.myType = 'test';
        } else if (this.myEye === 'eye_open') {
            this.myEye = 'eye';
            this.myType = 'password';
        }
    }

    async submit() {
      await this.navController.navigateRoot('/tabs');
      // TODO: Descomentar cuando se tenga el servicio de login en el Api de ScienceForChange
        // if (this.loginFormGroup.valid) {
        //     await this.commonService.showLoader();
        //     this.authService.login({
        //         email: this.email?.value,
        //         password: this.password?.value
        //     }).then(async result => {
        //         await this.commonService.hideLoader();
        //         if (result) {
        //             await this.navController.navigateRoot('/tabs');
        //         } else {
        //             await this.navController.navigateForward('/password-new');
        //         }
        //     }).catch(async response => {
        //         await this.commonService.hideLoader();
        //         const { code, message } = response?.error;
        //         const title = await this.translate.instant('global_error.label.header');
        //         const description = await this.translate.instant('global_error.label.credencial_invalid');
        //         if (code === 401) {
        //           await this.presentNotification("global_error.label.credencial_invalid", "", "danger")
        //         }
        //     });
        // }
    }
    async goToNoAccount() {
        window.open('https://docs.google.com/forms/d/e/1FAIpQLSedczglUfS5AhtBVXvB8S7ypbmvSzaauays-BHfWNDWMCYp6A/viewform', '_system', 'location=yes'); return false;
    }
  async presentNotification(message: string, message2Bold: string = "", color: "success" | "warning" | "danger" = "success", duration: number = 3000) {
    const modal = await this.modalController.create({
      component: AlertsComponent, // Reemplaza 'MiComponenteModalPage' con el nombre de tu componente modal
      cssClass: 'my-custom-modal',
      componentProps: {
        myText: message,
        myText2Bold: message2Bold,
        myColor: color,
        mySuccess: true,
      }
    });
    await modal.present();
    setTimeout(async () => {
      await modal.dismiss();
    }, duration);
  }
}
