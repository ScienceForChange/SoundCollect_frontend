import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import { queries } from '../_graphql/_queries';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PatientHTTP {

  constructor(
    private apollo: Apollo) {
  }

  async getPatientById(id: number|string) {
    // eslint-disable-next-line no-underscore-dangle
    const patient_id =  ((typeof id) === 'number') ? `/api/patients/${id}` : id;
    return lastValueFrom( this.apollo.query({
      query: queries.patient.getById(),
      variables: {id: patient_id}
    }));
  }

  async getActivitiesPatients(variables:any) {
    return await this.apollo.query({
      query: queries.patient.activitiesPatients(),
      variables
    }).toPromise();
  }

  async getCondensedPatient(variables:any) {
    return await this.apollo.query({
      query: queries.patient.condensedPatient(),
      variables
    }).toPromise();
  }
}
