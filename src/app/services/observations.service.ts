import { inject, Injectable } from '@angular/core';
import { ObservationsRepoHttp } from '../repos/observations-repo-http';
import { IObservation } from '../models/iobservation';

@Injectable({
  providedIn: 'root',
})

export class ObservationsService {
  private observationsRepoHttp = inject(ObservationsRepoHttp);
  constructor() { }

  async sendSound(data: FormData) {
    return await this.observationsRepoHttp.sendSound(data);
  }

  async calibrateSound(formData: any) {
    console.log('calibrateSound in services observationnnnn: ', formData);
    return await this.observationsRepoHttp.calibrateSound(formData);
  }

  async valueCalibration(val: number) {
    return await this.observationsRepoHttp.valueCalibration(val);
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
  getPolylineColorByDBA(leq: string) {
    if (+leq < 40) {
      return '#d9f2d0';
    } else if (+leq < 45) {
      return '#92d050';
    } else if (+leq < 50) {
      return '#4ea72e';
    } else if (+leq < 55) {
      return '#ffff00';
    } else if (+leq < 60) {
      return '#ffc000';
    } else if (+leq < 65) {
      return '#f2aa84';
    } else if (+leq < 70) {
      return '#ff0000';
    } else if (+leq < 75) {
      return '#c00000';
    } else if (+leq < 80) {
      return '#7030a0';
    } else if (+leq < 85) {
      return '#0f9ed5';
    } else {
      return '#215f9a';
    }
  }
}
