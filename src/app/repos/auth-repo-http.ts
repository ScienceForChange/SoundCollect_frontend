import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {inject, Injectable} from '@angular/core';
import {IToken, ICredentials, IChangePassword} from '../models/';
import {first, lastValueFrom} from 'rxjs';

@Injectable()
export class AuthHTTP {

  private http = inject(HttpClient);
  constructor() {}

  async login(credentials: ICredentials) {
    return this.http.post<IToken>(`${environment.serverURL}/authentication_token`, credentials, {}).pipe(first());
  }
  async changePassword(data: IChangePassword) {
    return this.http.post<any>(`${environment.serverURL}/api/change_password`, data, {}).pipe(first());
  }
  async resetPassword(email: string) {
    return this.http.post<any>(`${environment.serverURL}/reset-password-code`, {email}, {}).pipe(first());
  }
  async checkPasswordCode(code: string, newPassword: string) {
    return this.http.post<any>(`${environment.serverURL}/check-password-code`, {
      code,
      newPassword
    }, {}).pipe(first());
  }
  async verifyVersion(){
    return await lastValueFrom( this.http.post<any>(`${environment.serverURL}/api/verify-version`,{}));
  }

}
