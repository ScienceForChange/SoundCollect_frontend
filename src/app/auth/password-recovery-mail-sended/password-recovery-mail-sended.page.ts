import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonicModule, IonInput, NavController } from '@ionic/angular';
import { Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { ConfirmPasswordValidator } from '../../validator/confirm-password.validator';
import { AuthService, CommonService, CryptoService } from '../../services';
import { AuthHTTP } from '../../repos';
import { otpType } from '../password-recovery/password-recovery.page';
import { PasswordValidator } from 'src/app/validator/strong-pass.validator';

@Component({
    selector: 'app-password-recovery-mail-sended',
    templateUrl: './password-recovery-mail-sended.page.html',
    styleUrls: ['./password-recovery-mail-sended.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterLink,
        TranslateModule,
        ReactiveFormsModule
    ],
    providers: [HttpClient, AuthService, AuthHTTP]
})
export class PasswordRecoveryMailSendedPage implements OnInit {

    navController = inject(NavController);
    authService = inject(AuthService);
    commonService = inject(CommonService);
    router = inject(Router);
    translate = inject(TranslateService);
    fb = inject(FormBuilder);
    cryptoJS = inject(CryptoService);

    email!: string;
    dataNavigation: any;
    newFormGroup: FormGroup;
    myEye = ['eye', 'eye'];
    myType = ['password', 'password'];
    processing = false;
    model = {
        password: '',
        cpassword: '',
    };

    constructor() {
        this.newFormGroup = this.fb.group({
            password: [this.model.password, [Validators.required, Validators.minLength(8), PasswordValidator.strong]],
            cpassword: [this.model.cpassword, [Validators.required, Validators.minLength(8)]],
            code1: ['', [Validators.required]],
            code2: ['', [Validators.required]],
            code3: ['', [Validators.required]],
            code4: ['', [Validators.required]]
        }, {
            validator: ConfirmPasswordValidator.matchPassword
        });
    }

    ngOnInit() {
        const extras = this.router.getCurrentNavigation()?.extras!;
        this.email = extras.state?.['email'];
    }

    get password() {
        return this.newFormGroup.get('password');
    }

    get cpassword() {
        return this.newFormGroup.get('cpassword');
    }

    get _code1() {
        return this.newFormGroup.get('code1');
    }

    get _code2() {
        return this.newFormGroup.get('code2');
    }

    get _code3() {
        return this.newFormGroup.get('code3');
    }

    get _code4() {
        return this.newFormGroup.get('code4');
    }

    async resendOtpEmail() {
        const email = localStorage.getItem('resetpass-email');
        await this.commonService.showLoader();
        try {
            this.authService.requestOtp(email, otpType.newPassword)
                .then(async (result) => {
                    if (result?.status === 'success') {
                        await this.commonService.hideLoader();
                        this.commonService.alertModal('', result?.data?.message);
                    }
                }).catch(async (response) => {
                    if (response?.error?.status === 'fail') {
                        const message = await this.translate.instant(response?.error?.data?.message);
                      this.commonService.alertModal('', message);
                    }
                    await this.commonService.hideLoader();
                }).finally(() => this.commonService.hideLoader());
        }
        catch (e) {
            console.log(e);
        }
    }

    // async resetPassword() {
    //     await this.commonService.showLoader();
    //     this.authService.resetPassword(this.email).then(async result => {
    //         await this.commonService.hideLoader();
    //         const title = await this.translate.instant('global_error.label.header');
    //         if (result.status && result.message === 'RESET_PASSWORD_EMAIL_CODE_SENDED') {
    //             const message = await this.translate.instant('recovery_pass.label.RESET_PASSWORD_EMAIL_CODE_SENDED');
    //             await this.commonService.alertModal(title, message);
    //         }
    //     }).catch(async response => {
    //         await this.commonService.hideLoader();
    //         const title = await this.translate.instant('global_error.label.header');
    //         const { description } = response?.error;
    //         console.error(description);
    //         if (description === 'USER_NOT_FOUND') {
    //             const message = await this.translate.instant('recovery_pass.errors.USER_NOT_FOUND');
    //             await this.commonService.alertModal(title, message);
    //         }
    //     });
    // }

    changeImage(item: number) {
        if (this.myEye[item] === 'eye') {
            this.myEye[item] = 'eye_open';
            this.myType[item] = 'test';
        } else if (this.myEye[item] === 'eye_open') {
            this.myEye[item] = 'eye';
            this.myType[item] = 'password';
        }
    }

    async setFocus(nextElement: IonInput | IonButton | HTMLElement) {
      if (nextElement instanceof IonInput) {
        await nextElement.setFocus();
      }
    }

    async submit() {
      if (this.newFormGroup.invalid) {
        console.log(this.newFormGroup.errors);
        this.commonService.alertModal('Error', 'Debe completar todos los datos para continuar.');
      }else{
        await this.commonService.showLoader();

        const email = localStorage.getItem('resetpass-email');
        const pass = this.password?.value;
        const cpass = this.cpassword?.value;
        const otp = `${this._code1?.value}${this._code2?.value}${this._code3?.value}${this._code4?.value}`;

        try {
          this.authService.resetPassword(email, pass, cpass, otp).then(async result => {
            await this.commonService.hideLoader();
            const title = await this.translate.instant('global_error.label.header');
            if (result.status === 'success') {
              const message = await this.translate.instant('recovery_pass.label.password_changed');
              this.commonService.alertModal(title, message);
              await this.goTo('login');
            }
          }).catch(async response => {
            if (response?.error?.status === 'fail') {
              const message = await this.translate.instant(response?.error?.data?.message);
              this.commonService.alertModal('Error', message);
            }
            await this.commonService.hideLoader();
          });
        } catch (e) {
          await this.commonService.hideLoader();
          console.error(e);
        }
      }
    }

    async goTo(url: string) {
        await this.navController.navigateRoot([url], { replaceUrl: true });
    }

    goBack() {
        this.navController.back();
    }
}
