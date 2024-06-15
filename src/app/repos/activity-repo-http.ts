import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import { mutations } from '../_graphql/_mutations';
import {queries} from '../_graphql/_queries';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ActivitytHTTP {

  constructor(
    private http: HttpClient,
    private apollo: Apollo) {
  }

  async getActivities(variables: any) {
    return await this.apollo.query({
      query: queries.activities.getAll(),
      variables
    }).toPromise();
  }

  async getActivity(id: string) {
    return await this.apollo.query({
      query: queries.activities.getById(),
      variables: {
        id
      }
    }).toPromise();
  }

  async createFinish(variables: any) {
    return this.apollo.mutate<any>({
      mutation: mutations.activity.createFinish(),
      variables
    }).toPromise();
  }

  async programProgress(programPatient: string, activity: string, date: number) {
    return await this.http.get<any>(`https://apicampus.mutuaterrassa.cat:11443/api/program_patients/${programPatient}/${activity}/${date}`, {}).toPromise();
  }
}
