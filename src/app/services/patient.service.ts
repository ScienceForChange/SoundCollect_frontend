import {Injectable} from '@angular/core';
import {PatientHTTP} from '../repos/patient-repo-http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PatientService {

  patient: any;
  activitiesPatients: any;
  constructor(
    private patientHTTP: PatientHTTP) {
  }
  get getPatient() {
    return this.patient;
  }
  get getActPatients() {
    return this.activitiesPatients;
  }
  async getPatientById(id: number|string) {
    try {
      const patientResponse = await this.patientHTTP.getPatientById(id);
      console.log(patientResponse);
      
      // @ts-ignore
      if (!patientResponse.errors) {
        // @ts-ignore
        this.patient = patientResponse.data.patient;
        return this.patient;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getActivitiesPatients(variables: any) {
    try {
      const activitiesPatientsResponse = await this.patientHTTP.getActivitiesPatients(variables);
      // @ts-ignore
      if (!activitiesPatientsResponse.errors) {
        // @ts-ignore
        this.activitiesPatients = activitiesPatientsResponse.data.activitiesPatients;
        return this.activitiesPatients;
      }
    } catch (e) {
      console.error(e);
      return throwError(e).toPromise();
    }
  }

  async getCondensedPatient(variables: any) {
    try {
      const activitiesPatientsResponse = await this.patientHTTP.getCondensedPatient(variables);
      // @ts-ignore
      if (!activitiesPatientsResponse.errors) {
        // @ts-ignore
        this.activitiesPatients = activitiesPatientsResponse.data.condensedPatient;
        return this.activitiesPatients;
      }
    } catch (e) {
      console.error(e);
      return throwError(e).toPromise();
    }
  }
}
