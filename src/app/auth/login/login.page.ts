import { Component, inject, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { Router, RouterLink } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthHTTP } from '../../repos/';
import { CommonService, AuthService } from '../../services';
import { environment } from '../../../environments/environment';

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
    TranslateModule,
    NgOptimizedImage
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
  appVersion = environment.appVersion;

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

  async ngOnInit() {
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
    if (this.loginFormGroup.valid) {
      await this.commonService.showLoader();
      this.authService.login({
        email: this.email?.value,
        password: this.password?.value
      }).then(async result => {
        await this.commonService.hideLoader();
        if (result?.status === "success") {
          await this.authService.saveDataUser(result?.data);
          this.authService.isAuthenticated.next(true);
          await this.navController.navigateRoot('/tabs', {animated: false});
        } else {
          await this.navController.navigateForward('/password-new');
        }
      }).catch(async response => {
        await this.commonService.hideLoader();
        if (response?.status === 422) {
          const description = await this.translate.instant('global_error.label.credencial_invalid');
          this.commonService.alertModal("", description);
        }
      }).finally(() => this.commonService.hideLoader());
    }
  }

  async goToHome() {
    await this.navController.navigateRoot('/tabs', {animated: false});
  }
}
