import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { ProgramPatientHTTP } from '../repos/program-patient-http';

@Injectable({
  providedIn: 'root'
})
export class ProgramPatientService {

  hasProgram$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private programPatientService: ProgramPatientHTTP) {
  }

  gethasProgram$(): Observable<boolean> {
    return this.hasProgram$.asObservable();
  }
  async programPatients(variables: any) {
    try {
      const programPatientsResponse = await this.programPatientService.programPatients(variables);
      // @ts-ignore
      if (!programPatientsResponse.errors) {
        // @ts-ignore
        return programPatientsResponse.data.programPatients.collection;
      }
    } catch (e) {
      console.error(e);
      return throwError(e).toPromise();
    }
  }
  async getTotalAndProgressDays(variables: any): Promise<any> {
    try {
      const res = await this.programPatientService.getTotalAndProgressDays(variables);
      //console.log(res.data);
      if (res) return res.data.programPatient;
    } catch (e: any) {
      console.log(e);
      throwError(() => new Error(e.message));
    }
  }
  async getRestByProgramId(variables: any): Promise<any> {
    try {
      const res = await this.programPatientService.getRestByProgramId(variables);
      if (res) return res.data.program.restBetweenExercises;
    } catch (e: any) {
      console.log(e);
      throwError(() => new Error(e.message));
    }
  }
  async getProgramDescriptionByProgramId(variables: any): Promise<any> {
    try {
      const res = await this.programPatientService.getProgramDescriptionByProgramId(variables);
      if (res) return res.data.program.description;
    } catch (e: any) {
      console.log(e);
      throwError(() => new Error(e.message));
    }
  }
}
