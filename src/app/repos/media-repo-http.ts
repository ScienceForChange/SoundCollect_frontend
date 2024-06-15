import { Injectable, inject } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MediaRepoHttp {
  private http = inject(HttpClient);
  constructor() { }
  async sendMedia(data: FormData) {
    return lastValueFrom(this.http.post<any>(`${environment.serverURL}/api/multimedia`, data));
  }
}
