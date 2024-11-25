import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController, Platform, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";
import { ConfirmPasswordValidator } from 'src/app/validator/confirm-password.validator';
import { environment } from 'src/environments/environment';
import { AuthService, CommonService } from 'src/app/services';
import { UserCreate } from 'src/app/models/iuser';
import { PasswordValidator } from 'src/app/validator/strong-pass.validator';
import { DataService } from 'src/app/services/share-data.service';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.page.html',
  styleUrls: ['./create-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterLink, NgOptimizedImage],
  providers: [AuthService, CommonService, DataService, InAppBrowser]
})
export class CreateProfilePage implements OnInit {
  myEye = ['eye', 'eye'];
  myType = ['password', 'password'];

  navController = inject(NavController);
  // fb = inject(FormBuilder);
  authService = inject(AuthService);
  commonService = inject(CommonService);
  toastController = inject(ToastController);
  translate = inject(TranslateService);
  dataService = inject(DataService);

  myNumbers: [number] = [1900];
  regFormGroup: FormGroup;
  data = {
    name: '',
    email: '',
    password: '',
    cpassword: '',
    terms: true,
    birth_year: '',
    gender: ''
  };
  constructor(
    public formBuilder: FormBuilder,
    private iab: InAppBrowser,
    public platform: Platform,
  ) {
    for (let i = 1901; i <= 2100; i++) {
      this.myNumbers.push(i)
    }
  }

  ngOnInit() {
    this.regFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), PasswordValidator.strong]],
      cpassword: ['', [Validators.required, Validators.minLength(8)]],
      birth_year: ['2003'],
      gender: ['male'],
      terms: [true, [Validators.requiredTrue]],
      dataProtection: [true, [Validators.requiredTrue]],
    },
      {
        validator: ConfirmPasswordValidator.matchPassword
      }
    );
  }


  async createUser() {
    if (this.regFormGroup.valid) {
      await this.commonService.showLoader();
      const userData = new UserCreate(
        this.email?.value, this.password?.value, this.cpassword?.value,
        this.birth_year?.value, this.gender?.value, 'App');
      this.authService.register(userData).then(async result => {
        console.log('dataaaaa registerrrrrr', result);
        if (result?.status === "success") {
          await this.authService.saveDataUser(result?.data);
          await this.navController.navigateRoot('/greets');
        }else{
          const errorMessage = this.translate.instant('register.error.error_form_register');
          //TODO: add error message
          console.log('ha ocurrido un error al registrar el usuario');
          this.commonService.alertModal("", errorMessage);
        }
        await this.commonService.hideLoader();
      }).catch(async response => {
        await this.commonService.hideLoader();
        // const { errors, message } = response?.error;
        if (response?.status === 422) {
          const message = this.translate.instant('register.error.email_taken');
          this.commonService.alertModal("", message);
        }
      }).finally(async () => {
        await this.commonService.hideLoader();
      });
    } else {
      this.commonService.alertModal("", "Debe completar todos los campos")
    }

  }


  get name() {
    return this.regFormGroup.get('name');
  }
  get email() {
    return this.regFormGroup.get('email');
  }
  get password() {
    return this.regFormGroup.get('password');
  }
  get cpassword() {
    return this.regFormGroup.get('cpassword');
  }
  get terms() {
    return this.regFormGroup.get('terms');
  }
  get dataProtection() {
    return this.regFormGroup.get('dataProtection');
  }
  get birth_year() {
    return this.regFormGroup.get('birth_year');
  }
  get gender() {
    return this.regFormGroup.get('gender');
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

  goBack() {
    this.navController.back();
  }

  async goToLegalNotice() {
    await this.navController.navigateForward('privacy-policy');
  }

  async goToTerminos() {
    await this.navController.navigateForward('terms');
  }

  async goToWeb(url: string) {
    let translate_url:string = await this.translate.instant(url);
    const browser = this.iab.create(translate_url, '_blank', {
      location: this.platform.is('ios') ? 'no' : 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      toolbarposition: 'top',
      toolbarcolor: '#ffffff',
      closebuttoncolor: '#206A71',
      zoom: 'no',
      ZoomControlOptions: 'no', 
      closebuttoncaption: await this.translate.instant('about_me.buttons.btn_close'),
    });
  }

}
