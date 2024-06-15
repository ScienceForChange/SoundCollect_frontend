import {inject, Injectable} from '@angular/core';
import {ObservationsRepoHttp} from '../repos/observations-repo-http';
import {IObservation} from '../models/iobservation';

@Injectable({
  providedIn: 'root',
})

export class ObservationsService {
  private observationsRepoHttp = inject(ObservationsRepoHttp);
  constructor() { }

  async sendSound(data: FormData) {
    return  await this.observationsRepoHttp.sendSound(data);
  }

  async deleteObservation(uuid: string): Promise<any> {
    return await this.deleteObservation(uuid);
  }

  async postObservation(observation: any) {
    return await this.observationsRepoHttp.postObservation(observation);
  }

  async getObservationByUUID(uuid: string) {
    return await this.observationsRepoHttp.getObservationByUUID(uuid);
  }

  async getMyObservations() {
    return await this.observationsRepoHttp.getMyObservations();
  }

  async getMapObservations() {
    return await this.observationsRepoHttp.getMapObservations();
  }
}
