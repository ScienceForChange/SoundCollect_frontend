import {Component, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonicModule, IonModal, NavController} from '@ionic/angular';
import {AuthService, CommonService} from '../../services';
import {HttpClient} from '@angular/common/http';
import {AuthHTTP} from '../../repos';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {CommonModule, SlicePipe} from "@angular/common";
import {ComponentsModule} from '../../pipes/components.module';
import {Router, RouterLink} from '@angular/router';
import {UserService} from '../../services/user-service';
import {UserHTTP} from '../../repos/user-repo-http';
import {Subscription} from 'rxjs';
import {environment} from 'src/environments/environment';
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {NoUserAuthComponent} from "../../components/no-user-auth/no-user-auth.component";

@Component({
  selector: 'app-profile',
  templateUrl: 'profile.page.html',
  styleUrls: ['profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule, RouterLink, SlicePipe, ComponentsModule, NoUserAuthComponent,],
  providers: [HttpClient, AuthService, AuthHTTP, UserService, UserHTTP],
})
export class ProfilePage implements OnInit, OnDestroy {
  navController = inject(NavController);
  authService = inject(AuthService);
  common = inject(CommonService);
  router = inject(Router);
  sub!: Subscription;
  appVersion = environment.appVersion;
  finished = 0;
  gender: string | null;
  birthYear: number;
  readonly INTRO_KEY = 'has_seen_onboarding';
  readonly jwtTokenName = 'jwt_token';
  isUserAuth: boolean;

  constructor(
    private alertController: AlertController,
    private translate: TranslateService
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
    localStorage.clear();
    await this.common.setItem(this.INTRO_KEY, 'TRUE');
    this.authService.isAuthenticated.next(false);
    await this.authService.logout();
    await this.navController.navigateRoot('/login', { replaceUrl: true });
  }



  async goToChangePassword() {
    await this.navController.navigateForward("password-new");
  }

  async goToEditProfile() {
    let data = {
      gender: this.gender,
      birth_year: this.birthYear
    };
    await this.navController.navigateForward('/edit-profile', {
      queryParams: data
    });
  }

  async goToLegalNotice() {
    await this.navController.navigateForward('privacy-policy');
  }

  async goToLogin() {
    await this.navController.navigateForward('login');
  }

  async goToTerminos() {
    await this.navController.navigateForward('terms');
  }

  async goToMySounds() {
    await this.navController.navigateForward('sounds');
  }
}
