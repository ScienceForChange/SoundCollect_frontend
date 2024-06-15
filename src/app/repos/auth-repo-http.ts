import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { IToken, ICredentials, IChangePassword } from '../models/';
import { first, lastValueFrom } from 'rxjs';
import { UserCreate } from '../models/iuser';

@Injectable()
export class AuthHTTP {

  private http = inject(HttpClient);
  constructor() { }

  async login(credentials: ICredentials) {
    return this.http.post<any>(`${environment.serverURL}/api/login`, credentials, {}).pipe(first());
  }
  async user() {
    return this.http.get<any>(`${environment.serverURL}/api/user`, {}).pipe(first());
  }
  async logout() {
    return this.http.post<any>(`${environment.serverURL}/api/logout`, {}).pipe(first());
  }

  async changePassword(data: IChangePassword) {
    return this.http.post<any>(`${environment.serverURL}/api/change_password`, data, {}).pipe(first());
  }

  async resetPassword(email: string | null, new_password: string, new_password_confirmation: string, otp: string) {
    return this.http.post<any>(`${environment.serverURL}/api/reset-password`,
      { email, new_password, new_password_confirmation, otp }, {}).pipe(first());
  }

  async requestOtp(email: string | null, type: string) {
    return this.http.post<any>(`${environment.serverURL}/api/otp/generate`, { email, type }, {}).pipe(first());
  }

  async verifyEmail(email: string, otp: string) {
    return this.http.post<any>(`${environment.serverURL}/api/verify-email`, { email, otp }, {}).pipe(first());
  }

  async checkPasswordCode(code: string, newPassword: string) {
    return this.http.post<any>(`${environment.serverURL}/check-password-code`, {
      code,
      newPassword
    }, {}).pipe(first());
  }
  async verifyVersion() {
    return await lastValueFrom(this.http.post<any>(`${environment.serverURL}/api/verify-version`, {}));
  }
  // Users crud
  async register(info: UserCreate) {
    return await this.http.post(`${environment.serverURL}/api/register`, info, {}).toPromise();
  }

  async generateOtp(email: string, type: string) {
    return this.http.post<any>(`${environment.serverURL}/api/otp/generate`, {
      email,
      type
    }, {}).pipe(first());
  }

  async removeProfile() {
    return await this.http.delete(`${environment.serverURL}/api/user/profile/delete`, {}).toPromise();
  }

  async updateProfile(gender: string, birth_year: number) {
    return await this.http.patch(`${environment.serverURL}/api/user/profile/edit`, { gender, birth_year }).toPromise();
  }
}
