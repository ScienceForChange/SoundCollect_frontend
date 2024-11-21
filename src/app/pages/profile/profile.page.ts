import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicModule, IonModal, ModalController, NavController, Platform, ViewWillEnter } from '@ionic/angular';
import { AuthService, CommonService } from '../../services';
import { HttpClient } from '@angular/common/http';
import { AuthHTTP } from '../../repos';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule, SlicePipe } from "@angular/common";
import { ComponentsModule } from '../../pipes/components.module';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserHTTP } from '../../repos/user-repo-http';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { addWarning } from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import { NoUserAuthComponent } from "../../components/no-user-auth/no-user-auth.component";
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, RouterLink, SlicePipe, ComponentsModule, NoUserAuthComponent],
  providers: [HttpClient, AuthService, AuthHTTP, UserService, UserHTTP, ObservationsService, ObservationsRepoHttp, InAppBrowser],
})
export class ProfilePage implements OnInit, OnDestroy {
  navController = inject(NavController);
  authService = inject(AuthService);
  common = inject(CommonService);
  router = inject(Router);
  private modalController = inject(ModalController);
  private userService = inject(UserService);
  sub!: Subscription;
  appVersion = environment.appVersion;
  finished = 0;
  gender: string | null;
  email: string | null;
  birthYear: number;
  readonly INTRO_KEY = 'has_seen_onboarding';
  readonly jwtTokenName = 'jwt_token';
  isUserAuth: boolean;
  level: number = 0;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService,
    private iab: InAppBrowser,
    public platform: Platform,
  ) { }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();

  }

  async ngOnInit() {
    const token = await this.common.getItem(this.jwtTokenName);
    if (token) {
      this.isUserAuth = true;
    }
    this.authService.gender.subscribe(
      gender => {
        this.gender = gender;
      }
    );
    this.authService.birthYear.subscribe(
      birthYear => {
        this.birthYear = birthYear;
      }
    );
    this.authService.email.subscribe(
      email => {
        this.email = email;
      }
    );

    this.level = await this.userService.gamificationLevel();
    // this.route.queryParams.subscribe(async (params) => {
    //   if (params && params['gender'] && params['birth_year']) {
    //     this.gender = params['gender'];
    //     this.birthYear = params['birth_year'];
    //   }
    // });
  };

  calcAge() {
    const fechaActual = new Date();
    const anoActual = fechaActual.getFullYear();
    return anoActual - this.birthYear;
  }

  async logout() {
    const message = await this.translate.instant('about_me.label.close_session');
    const btn_accept = await this.translate.instant('about_me.buttons.btn_accept');
    const btn_cancel = await this.translate.instant('about_me.buttons.btn_cancel');
    const alert = await this.alertController.create({
      header: message,
      mode: 'ios',
      buttons: [
        {
          text: btn_accept,
          handler: async () => {
            await this.closeSession();
          }
        },
        {
          text: btn_cancel,
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });
    await alert.present();
  }

  async closeSession() {
    await this.authService.logout();
  }

  async goToChangePassword() {
    await this.navController.navigateForward("password-new");
  }

  async goToEditProfile() {
    let data = {
      gender: this.gender,
      birth_year: this.birthYear,
      email: this.email
    };

    await this.openModal(data);
  }

  async openModal(data: any) {
    const modal = await this.modalController.create({
      component: EditProfilePage,
      componentProps: {
        data: data // Pasar datos adicionales usando componentProps
      },
      cssClass: 'full-size-modal'
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.birthYear = data.data.birthYear;
        this.gender = data.data.gender;
      }
    });

    return await modal.present();
  }

  async goToLegalNotice() {
    await this.navController.navigateForward('privacy-policy');
  }

  async goToTerminos() {
    await this.navController.navigateForward('terms');
  }

  async goToWeb(url: string) {
    const browser = this.iab.create(url, '_blank', {
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
