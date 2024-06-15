import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import {Router, RouterLink} from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmPasswordValidator } from '../../validator/confirm-password.validator';
import { AuthService, CommonService, CryptoService } from '../../services';
import { AuthHTTP } from '../../repos/auth-repo-http';

@Component({
    selector: 'app-password-new',
    templateUrl: './password-new.page.html',
    styleUrls: ['./password-new.page.scss'],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterLink],
    providers: [HttpClient, AuthService, AuthHTTP]
})
export class PasswordNewPage implements OnInit {
    navController = inject(NavController);
    authService = inject(AuthService);
    commonService = inject(CommonService);
    router = inject(Router);
    translate = inject(TranslateService);
    fb = inject(FormBuilder);
    cryptoJS = inject(CryptoService);
    toastController = inject(ToastController);

    newFormGroup: FormGroup;
    myEye = ['eye', 'eye', 'eye'];
    myType = ['password', 'password', 'password'];
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
        }, {
            validator: ConfirmPasswordValidator.matchPassword
        });
    }

    get password() {
        return this.newFormGroup.get('password');
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    get cpassword() {
        return this.newFormGroup.get('cpassword');
    }

    get lpassword() {
        return this.newFormGroup.get('lpassword');
    }

    ngOnInit(): void {
    }

    async submit() {
        if (this.newFormGroup.valid) {
            await this.commonService.showLoader();
            const email = await this.commonService.getItem(this.authService.email);
            this.authService.changePassword({
                // @ts-ignore
                email,
                oldPassword: this.cryptoJS.encrypt(this.lpassword?.value),
                newPassword: this.cryptoJS.encrypt(this.cpassword?.value)
            }).then(async result => {
                console.log('result', result);
                await this.commonService.hideLoader();
                const toast = await this.toastController.create({
                    message: this.translate.instant('change_pass.label.change_success'),
                    header: this.translate.instant('global_error.label.header'),
                    color: "information",
                    duration: 3000,
                    position: 'middle',
                    icon:'checkmark-circle-outline',
                    buttons: [
                        {
                            icon: 'close',
                            role: 'cancel',
                            side: 'end'
                        },
                    ]

                });
                await toast.present();
                await this.navController.navigateRoot('/tabs');
            }).catch(async response => {
                await this.commonService.hideLoader();
                const { title, description } = response?.error;
                if (description === 'INCORRECT_OLD_PASSWORD') {
                    await this.commonService.alertModal('Información', 'Contraseña anterior incorrecta.');
                }
            });
        }
    }

    changeImage(pos: number) {
        if (this.myEye[pos] === 'eye') {
            this.myEye[pos] = 'eye_open';
            this.myType[pos] = 'test';
        } else if (this.myEye[pos] === 'eye_open') {
            this.myEye[pos] = 'eye';
            this.myType[pos] = 'password';
        }
    }

    async goTo(url: string) {
        await this.router.navigate([url]);
    }
    goBack() {
        this.navController.back();
    }
}
