import { inject, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { AuthHTTP } from '../repos';
import { CommonService } from './common.service';
import { UserCreate } from '../models/iuser';
import { ICredentials } from "../models";

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authHTTP = inject(AuthHTTP);
  private navController = inject(NavController);
  private commonService = inject(CommonService);

  readonly jwtTokenName = 'jwt_token';
  readonly locale = 'locale';
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token: BehaviorSubject<string> = new BehaviorSubject<string>('');
  email: BehaviorSubject<string> = new BehaviorSubject<string>('');
  birthYear: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  gender: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
  ) {
    this.checkToken().then();
  }

  async checkToken() {
    const token = await this.commonService.getItem(this.jwtTokenName);
    if (token) {
      this.token.next(token);
      this.isAuthenticated.next(true);
      const gender = await this.commonService.getItem('gender');
      const birthYear = await this.commonService.getItem('birthYear');
      if (gender) {
        this.gender.next(gender);
      }
      if (birthYear) {
        this.birthYear.next(Number(birthYear));
      }
    }
  }

  getToken() {
    return this.token.getValue();
  }

  async login(credentials: ICredentials) {
    const data$ = await this.authHTTP.login(credentials);
    return await lastValueFrom(data$);
  }

  async saveDataUser(data: any) {
    try {
      this.isAuthenticated.next(true);
      await this.commonService.setItem(this.jwtTokenName, data.token);
      this.gender.next(data?.user?.attributes?.profile?.gender);
      this.birthYear.next(data?.user?.attributes?.profile?.birthYear);
      await this.commonService.setItem('gender', data?.user?.attributes?.profile?.gender);
      await this.commonService.setItem('birthYear', data?.user?.attributes?.profile?.birthYear);
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  // async changePassword(credentials: IChangePassword) {
  //   const data$ = await this.authHTTP.changePassword(credentials);
  //   const result = await lastValueFrom(data$);
  //   console.log('result', result);
  //   const firstLogin = await this.commonService.getItem(this.firstLogin);
  //   if (firstLogin === 'TRUE') {
  //     await this.setFirsLogin('FALSE');
  //   }
  //   return true;
  // }

  async resetPassword(email: string | null, new_password: string, new_password_confirmation: string, otp: string) {
    const data$ = await this.authHTTP.resetPassword(email, new_password, new_password_confirmation, otp);
    return await lastValueFrom(data$);
  }

  async checkPasswordCode(code: string, newPassword: string) {
    const data$ = await this.authHTTP.checkPasswordCode(code, newPassword);
    return await lastValueFrom(data$);
  }

  async requestOtp(email: string | null, type: string) {
    const data$ = await this.authHTTP.requestOtp(email, type);
    return await lastValueFrom(data$);
  }

  async verifyEmail(email: string, otp: string) {
    const data$ = await this.authHTTP.verifyEmail(email, otp);
    return await lastValueFrom(data$);
  }

  async logout() {
    try {
      await this.authHTTP.logout();
    }
    catch (e) {
      console.log(e);
    }

  }

  async getUser(): Promise<any> {
    const data$ = await this.authHTTP.user();
    return await lastValueFrom(data$);
  }

  async verifyVersion() {
    return await this.authHTTP.verifyVersion();
  }

  async register(info: UserCreate): Promise<any> {
    return await this.authHTTP.register(info);
  }

  async removeProfile() {
    return await this.authHTTP.removeProfile();
  }

  async updateProfile(gender: string, birth_year: number) {
    return await this.authHTTP.updateProfile(gender, birth_year);
  }
}
