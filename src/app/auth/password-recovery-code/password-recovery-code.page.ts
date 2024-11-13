import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from 'src/app/services/share-data.service';
// import { UserCreate } from 'src/app/models/iuser';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonicModule, IonInput, NavController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, CommonService } from '../../services';
import { UserCreate } from 'src/app/models/iuser';

@Component({
    selector: 'app-password-recovery-code',
    templateUrl: './password-recovery-code.page.html',
    styleUrls: ['./password-recovery-code.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule, ReactiveFormsModule]
})
export class PasswordRecoveryCodePage implements OnInit {

    route = inject(ActivatedRoute);
    router = inject(Router);
    dataService = inject(DataService);
    translate = inject(TranslateService);
    fb = inject(FormBuilder);
    commonService = inject(CommonService);
    authService = inject(AuthService);
    navController = inject(NavController);

    userCreate: UserCreate;
    otpFormGroup: FormGroup;

    constructor() {
        this.userCreate = this.dataService.datosCompartidos;
        this.otpFormGroup = this.fb.group({
            field1: ['', [Validators.required]],
            field2: ['', [Validators.required]],
            field3: ['', [Validators.required]],
            field4: ['', [Validators.required]],
        });
    }
    get field1() {
        return this.otpFormGroup.get('field1')?.value;
    }
    get field2() {
        return this.otpFormGroup.get('field2')?.value;
    }
    get field3() {
        return this.otpFormGroup.get('field3')?.value;
    }
    get field4() {
        return this.otpFormGroup.get('field4')?.value;
    }

    async ngOnInit() {
    }

    async gotoNextField(nextElement: IonInput | IonButton | HTMLElement) {
        if (nextElement instanceof IonInput) {
            await nextElement.setFocus();
        } else if (nextElement instanceof IonButton) {
            // @ts-ignore
            nextElement.el.focus();
        }
    }

    async goTo(url: string) {
        await this.router.navigate([url]);
    }

    getOtpInputed(): string {
        return this.field1.toString() + this.field2.toString() + this.field3.toString() + this.field4.toString();
    }

    async veryfyOtp() {
        if (this.otpFormGroup.valid) {
            let otp = this.getOtpInputed();
            await this.commonService.showLoader();
            try {
                const email = localStorage.getItem('resetpass-email') as string;
                this.authService.verifyEmail(email, otp)
                    .then((result) => {
                        this.commonService.hideLoader();
                        if (result) {
                            console.log(result["status"])
                            this.navController.navigateForward('password-new');
                        }
                        //  "status": "We have emailed your password reset link."
                    }).catch((res) => {
                        console.log(res?.error?.message);
                        // TODO:ELiminar esto, es solo para probar
                        this.navController.navigateForward('password-new');
                        this.commonService.hideLoader();
                    }).finally(() => this.commonService.hideLoader());
            }
            catch (e) {
                console.log(e);
                await this.navController.navigateForward('password-new');
            }
        }
    }

    async createUser() {
        await this.commonService.showLoader();
        this.authService.register(this.userCreate).then(async result => {
            if (result?.status === 'success') {
                localStorage.setItem('jwt_token', result?.data?.token);
                await this.commonService.hideLoader();
                await this.navController.navigateRoot('/greets');
            }
        }).catch(async response => {
            await this.commonService.hideLoader();
            // const { errors, message } = response?.error;
            if (response?.status === 422) {
                const message = this.translate.instant('register.error.email_taken');
                await this.commonService.presentNotification(message, "", "danger")
            }
            // const title = await this.translate.instant('global_error.label.header');
            // const description = await this.translate.instant('global_error.label.credencial_invalid');
            // if (code === 401) {
            //   await this.presentNotification("global_error.label.credencial_invalid", "", "danger")
            // }
        }).finally(async () => {
            await this.commonService.hideLoader();
        });
    }
}
