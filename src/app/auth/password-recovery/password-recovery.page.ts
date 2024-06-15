import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { AuthService, CommonService } from '../../services';
import { AuthHTTP } from '../../repos/';


export const otpType = {
  newPassword: 'new-password'
};

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.page.html',
  styleUrls: ['./password-recovery.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  providers: [HttpClient, AuthService, AuthHTTP]
})
export class PasswordRecoveryPage implements OnInit {
  navController = inject(NavController);
  commonService = inject(CommonService);
  authService = inject(AuthService);
  router = inject(Router);
  translate = inject(TranslateService);
  fb = inject(FormBuilder);


  resetFormGroup: FormGroup;
  email!: string;
  constructor() {
    this.resetFormGroup = this.fb.group({
      email: [this.email, [Validators.required, Validators.email]]
    });
  }
  get _email() {
    return this.resetFormGroup.get('email');
  }
  ngOnInit() {
  }

  goBack() {
    this.navController.back();
  }

  async sendEmail() {
    if (this.resetFormGroup.valid) {
      await this.commonService.showLoader();
      try {
        this.authService.requestOtp(this._email?.value, otpType.newPassword)
          .then((result) => {
            this.commonService.hideLoader();
            if (result) {
              localStorage.setItem("resetpass-email", this._email?.value);
              this.navController.navigateForward('password-recovery-mail-sended');
            }else{
              this.commonService.alertModal('', 'El email introducido no tiene una cuenta activa en SouncCollect. Puedes acceder como invitado o crear una nueva cuenta.')
            }
            //  "status": "We have emailed your password reset link."
          }).catch((error) => {
            console.log(error?.errors?.message);
            this.commonService.hideLoader();
            this.commonService.alertModal('', 'Ha ocurrido un error, por favor intente más tarde.')
          }).finally(() => this.commonService.hideLoader());
      }
      catch (e) {
        console.log(e);
      }
    }else{
      this.commonService.alertModal('', 'Debe ingresar un correo electrónico válido.');
    }
  }
}
