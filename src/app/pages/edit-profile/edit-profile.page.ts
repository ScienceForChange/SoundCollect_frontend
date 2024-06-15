import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IUserData } from 'src/app/models';
import { UserService } from 'src/app/services/user-service';
import { AuthHTTP } from 'src/app/repos';
import { HttpClient } from '@angular/common/http';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule, FormsModule, RouterLink, TranslateModule],
  providers: [HttpClient, AuthService, AuthHTTP, UserService, UserHTTP]
})
export class EditProfilePage implements OnInit {
  private navController = inject(NavController);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private common = inject(CommonService);
  translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  profileForm!: FormGroup;
  userData!: IUserData;
  myNumbers: [number] = [1900];

  gender_: string = '';
  birth_year_: number = 1900;

  constructor() {
    for (let i = 1901; i <= 2008; i++) {
      this.myNumbers.push(i)
    }

    this.profileForm = new FormGroup({
      gender: new FormControl(this.gender_),
      birth_year: new FormControl(this.birth_year_),
    });
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      if (params && params['gender'] && params['birth_year']) {
        this.gender?.setValue(params['gender']);
        this.birth_year?.setValue(params['birth_year']);
      }
    });

  }

  get gender() {
    return this.profileForm.get('gender');
  }

  get birth_year() {
    return this.profileForm.get('birth_year');
  }

  async sendProfileForm() {
    console.log("Send");
    try {
      await this.common.showLoader();
      await this.authService.updateProfile(this.gender?.value, this.birth_year?.value)
        .then(async () => {
          await this.common.setItem('gender', this.gender?.value);
          await this.common.setItem('birthYear', this.birth_year?.value);
          this.authService.gender.next(this.gender_.toString());
          this.authService.birthYear.next(this.birth_year_);
          await this.common.hideLoader();
          // await this.router.navigateByUrl('/tabs/profile');
          this.router.navigateByUrl('/tabs/profile')
            .then(() => {
              window.location.reload();
            });
          // await this.navController.back();
        }).catch((e) => {
          console.error(e.toString());
        }).finally(async () => {
          await this.common.hideLoader();
        });
    } catch (error) {
      await this.common.presentToast(
        this.translate.instant('global_error.label.header'),
        this.translate.instant('global_error.label.message'), 'danger');
    } finally {
      await this.common.hideLoader();
    }

  }
  goBack() {
    this.navController.back();
  }
}
