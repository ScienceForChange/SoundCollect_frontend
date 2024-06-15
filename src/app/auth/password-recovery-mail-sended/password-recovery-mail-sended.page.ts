import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonButton, IonicModule, IonInput, NavController} from '@ionic/angular';
import {Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {ConfirmPasswordValidator} from '../../validator/confirm-password.validator';
import {AuthService, CommonService, CryptoService} from '../../services';
import {AuthHTTP} from '../../repos';

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
        lpassword: ''
    };

    constructor() {
        this.newFormGroup = this.fb.group({
            password: [this.model.password, [Validators.required]],
            lpassword: [this.model.lpassword, [Validators.required]],
            cpassword: [this.model.cpassword, [Validators.required]],
            step1: ['', [Validators.required]],
            step2: ['', [Validators.required]],
            step3: ['', [Validators.required]],
            step4: ['', [Validators.required]]
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

    get _step1() {
        return this.newFormGroup.get('step1');
    }

    get _step2() {
        return this.newFormGroup.get('step2');
    }

    get _step3() {
        return this.newFormGroup.get('step3');
    }

    get _step4() {
        return this.newFormGroup.get('step4');
    }

    get lpassword() {
        return this.newFormGroup.get('lpassword');
    }

    async resetPassword() {
        await this.commonService.showLoader();
        this.authService.resetPassword(this.email).then(async result => {
            await this.commonService.hideLoader();
            const title = await this.translate.instant('global_error.label.header');
            if (result.status && result.message === 'RESET_PASSWORD_EMAIL_CODE_SENDED') {
                const message = await this.translate.instant('recovery_pass.label.RESET_PASSWORD_EMAIL_CODE_SENDED');
                await this.commonService.alertModal(title, message);
            }
        }).catch(async response => {
            await this.commonService.hideLoader();
            const title = await this.translate.instant('global_error.label.header');
            const {description} = response?.error;
            console.error(description);
            if (description === 'USER_NOT_FOUND') {
                const message = await this.translate.instant('recovery_pass.errors.USER_NOT_FOUND');
                await this.commonService.alertModal(title, message);
            }
        });
    }

    changeImage(item: number) {
        if (this.myEye[item] === 'eye') {
            this.myEye[item] = 'eye_open';
            this.myType[item] = 'test';
        } else if (this.myEye[item] === 'eye_open') {
            this.myEye[item] = 'eye';
            this.myType[item] = 'password';
        }
    }

    async gotoNextField(nextElement: IonInput | IonButton | HTMLElement) {
        if (nextElement instanceof IonInput) {
            await nextElement.setFocus();
        } else if (nextElement instanceof IonButton) {
            // @ts-ignore
            nextElement.el.focus();
        }
    }

    async submit() {
        await this.commonService.showLoader();
        this.authService.checkPasswordCode(
            `${this._step1?.value}${this._step2?.value}${this._step3?.value}${this._step4?.value}`,
            this.cryptoJS.encrypt(this.password?.value)
        ).then(async result => {
            await this.commonService.hideLoader();
            const title = await this.translate.instant('global_error.label.header');
            if (result.status && result.description === 'INVALID_CHANGE_PASSWORD_CODE') {
                const message = await this.translate.instant('recovery_pass.label.INVALID_CHANGE_PASSWORD_CODE');
                await this.commonService.alertModal(title, message);
            } else if (result.status) {
                const message = await this.translate.instant('recovery_pass.label.password_changed');
                await this.authService.setFirsLogin('FALSE');
                await this.commonService.alertModal(title, message);
                await this.goTo('login');
            }
        }).catch(async response => {
            await this.commonService.hideLoader();
            console.error(response);
        });
    }

    async goTo(url: string) {
        await this.navController.navigateRoot([url], {replaceUrl: true});
    }

  goBack() {
    this.navController.back();
  }
}
