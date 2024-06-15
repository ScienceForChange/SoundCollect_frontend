import { inject, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IChangePassword, ICredentials, IToken } from '../models';
import { AuthHTTP } from '../repos/auth-repo-http';
import { CommonService } from './common.service';
import { TranslateService } from '@ngx-translate/core';
import { ITokenDecoded } from '../models/itoken-decoded';
const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authHTTP = inject(AuthHTTP);
  private navController = inject(NavController);
  private commonService = inject(CommonService);

  readonly jwtTokenName = 'jwt_token';
  readonly jwtTokenRefresh = 'jwt_token_refresh';
  readonly firstLogin = 'first_login';
  readonly username = 'username';
  readonly email = 'email';
  readonly locale = 'locale';
  readonly INTRO_KEY = 'has_seen_onboarding';
  jwtHelper: JwtHelperService = new JwtHelperService();
  isAuthenticated: BehaviorSubject<boolean | string> = new BehaviorSubject<boolean | string>('');
  constructor(
    private translate: TranslateService
  ) { }

  async login(credentials: ICredentials) {
    const data$ = await this.authHTTP.login(credentials);
    const token = await lastValueFrom(data$);
    if ('token' in token) {
      return await this.saveToken(token);
    } else {
      return false;
    }
  }
  async saveToken(token: IToken): Promise<boolean> {
    try {
      const decoded = helper.decodeToken(token.token);
      console.log('decoded decoded decoded', decoded);
      if (decoded.roles[0] === 'ROLE_PATIENT') {
        this.isAuthenticated.next(true);
        await this.commonService.setItem(this.username, decoded.user.username);
        await this.commonService.setItem(this.email, decoded.user.email);
        await this.commonService.setItem(this.locale, decoded.user.locale);
        await this.commonService.setItem(this.jwtTokenName, token.token);
        await this.commonService.setItem(this.jwtTokenRefresh, token.refresh_token);
        localStorage.setItem(this.jwtTokenName, token.token);
        localStorage.setItem(this.jwtTokenRefresh, token.refresh_token);
        const firstLogin = await this.commonService.getItem(this.firstLogin);
        if (!decoded.user.lastLogin && ((!firstLogin) || (firstLogin !== 'FALSE'))) {
          await this.setFirsLogin('TRUE');
          await this.navController.navigateForward('/password-new');
          return false;
        } else {
          await this.setFirsLogin('FALSE');
          return true;
        }
      } else {
        const title = await this.translate.instant('global_error.label.header');
        const message = await this.translate.instant('global_error.label.user_invalid');
        this.commonService.alertModal(title, message);
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }
  async changePassword(credentials: IChangePassword) {
    const data$ = await this.authHTTP.changePassword(credentials);
    const result = await lastValueFrom(data$);
    console.log('result', result);
    const firstLogin = await this.commonService.getItem(this.firstLogin);
    if (firstLogin === 'TRUE') {
      await this.setFirsLogin('FALSE');
    }
    return true;
  }
  async resetPassword(email: string) {
    const data$ = await this.authHTTP.resetPassword(email);
    return await lastValueFrom(data$);
  }

  async checkPasswordCode(code: string, newPassword: string) {
    const data$ = await this.authHTTP.checkPasswordCode(code, newPassword);
    return await lastValueFrom(data$);
  }

  async logout() {
    await this.commonService.removeItem(this.jwtTokenName);
    await this.commonService.removeItem(this.jwtTokenRefresh);
    await this.commonService.removeItem(this.username);
    await this.commonService.removeItem(this.email);
    await this.commonService.removeItem(this.locale);
    localStorage.removeItem(this.jwtTokenName);
    localStorage.removeItem(this.jwtTokenRefresh);

    this.isAuthenticated.next(false);
    await this.goToLogin();
  }
  async getFisrtLogin() {
    return await this.commonService.getItem(this.firstLogin);
  }
  async setFirsLogin(value: string) {
    return await this.commonService.setItem(this.firstLogin, value);
  }
  async getUser(): Promise<ITokenDecoded> {
    const jwtHelper = new JwtHelperService();
    const token = await this.commonService.getItem(this.jwtTokenName);
    // @ts-ignore
    return jwtHelper.decodeToken(token);
  }
  async goToLogin() {
    await this.navController.navigateRoot('/login', { replaceUrl: true });
  }
  async verifyVersion() {
    return await this.authHTTP.verifyVersion();
  }
}
