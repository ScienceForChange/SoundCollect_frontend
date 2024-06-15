import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import {Router, RouterLink} from "@angular/router";
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {AuthService, CommonService} from '../../services';
import {AuthHTTP} from '../../repos/';

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
}
