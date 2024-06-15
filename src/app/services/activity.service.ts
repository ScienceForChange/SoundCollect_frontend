import {Injectable} from '@angular/core';
import {ActivitytHTTP} from '../repos/activity-repo-http';
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private activitytHTTP: ActivitytHTTP) {
  }

  async getActivities(variables: any) {
    try {
      const activitiesResponse = await this.activitytHTTP.getActivities(variables);
      // @ts-ignore
      if (!activitiesResponse.errors) {
        // @ts-ignore
        return activitiesResponse.data.activities;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async getActivity(id: string) {
    try {
      const activityResponse = await this.activitytHTTP.getActivity(id);
      // @ts-ignore
      if (!activityResponse.errors) {
        // @ts-ignore
        return activityResponse.data.activity;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async createFinish(variables: any) {
    try {
      const createFinishedActivityResponse = await this.activitytHTTP.createFinish(variables);
      // @ts-ignore
      if (!createFinishedActivityResponse.errors) {
        // @ts-ignore
        return createFinishedActivityResponse.data.createFinishedActivity;
      }
    } catch (e) {
      console.error(e);
      return throwError(e).toPromise();
    }
  }

  async programProgress(programPatient: string, activity: string, date: number) {
    try {
      return await this.activitytHTTP.programProgress(programPatient, activity, date);
    } catch (e) {
      console.error(e);
    }
  }
}
