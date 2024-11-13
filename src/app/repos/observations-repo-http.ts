import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { IObservation } from '../models/iobservation';

@Injectable()
export class ObservationsRepoHttp {
  private http = inject(HttpClient);
  constructor() { }

  async sendSound(data: FormData) {
   return lastValueFrom(this.http.post<any>(`${environment.serverURL}/api/audio-process`, data));
  }

  async calibrateSound(formData: any) {
    console.log('calibrateSound in repooooo http para enviar: ', formData)
    return lastValueFrom(this.http.post<any>(`${environment.serverCalibrationURL}/calibrate`, formData));
  }

  async valueCalibration(val: number) {
    return lastValueFrom(this.http.post<any>(`${environment.serverURL}/api/user/autocalibration`, { autocalibration: val }));
  }
  async calSoundParameters(formData: any,autocalibration:number) {
    console.log('cal parameters: ', formData)
    return lastValueFrom(this.http.post<any>(`${environment.serverCalibrationURL}/convert_audio_into_parameters/${autocalibration}`, formData));
  }
  /**
   * Deletes an observation
   * @param uuid
   * @returns
   */
  async deleteObservation(uuid: string) {
    return await lastValueFrom(this.http.delete<any>(`${environment.serverURL}/api/observations/${uuid}`));
  }

  /**
   * Store an observation in the database.
   * @param observation
   * @returns
   */
  async postObservation(observation: IObservation) {
    return lastValueFrom(this.http.post<any>(`${environment.serverURL}/api/observations`, observation));
  }

  /**
   * @param uuid
   * @returns Returns an observation object.
   */
  async getObservationByUUID(uuid: string) {
    return await lastValueFrom(this.http.get<any>(`${environment.serverURL}/api/observations/${uuid}`));
  }

  /**
   * @returns Returns a list of all observations in the database.
   */
  async getMyObservations() {
    return await lastValueFrom(this.http.get<any>(`${environment.serverURL}/api/user/observations`));
  }

  async getMapObservations() {
    return await lastValueFrom(this.http.get<any>(`${environment.serverURL}/api/map/observations`));
  }
}
