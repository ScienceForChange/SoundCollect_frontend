import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { lastValueFrom, of } from 'rxjs';
import { mutations } from '../_graphql/_mutations';
import { queries } from '../_graphql/_queries';

@Injectable()
export class UserHTTP {

  constructor(private apollo: Apollo) {
  }

  createUserRecord(userRecordOptions: any): Promise<any> {
    try {
      return lastValueFrom(this.apollo.mutate<any>({
        mutation: mutations.userRecord.create(),
        variables: userRecordOptions
      }));
    } catch (e) {
      return new Promise((resolve) => {
        of(resolve);
      });
    }
  }

  updateUserRecord(id: string, value: string, detail: string): Promise<any> {
    try {
      const values: any = {
        id,
        value,
        detail
      };
      return lastValueFrom(this.apollo.mutate<any>({
        mutation: mutations.userRecord.update(),
        variables: values
      }));
    } catch (e) {
      return new Promise((resolve) => {
        of(resolve);
      });
    }
  }

  removeUserRecord(id: string): Promise<any> {
    try {
      const values: any = {
        id
      };
      return lastValueFrom(this.apollo.mutate<any>({
        mutation: mutations.userRecord.remove(),
        variables: values
      }));
    } catch (e) {
      return new Promise((resolve) => {
        of(resolve);
      });
    }
  }
  existUserRecord(variables: any): Promise<any> {
    return lastValueFrom(this.apollo.query({
      query: queries.userRecord.existUserRecord(),
      variables
    }));
  }
  getUserRecord(variables: any): Promise<any> {
    return lastValueFrom(this.apollo.query({
      query: queries.userRecord.getUserRecord(),
      variables
    }));
  }
  async getUserByIdSimple(id: number|string) {
    // eslint-disable-next-line no-underscore-dangle
    const patient_id =  ((typeof id) === 'number') ? `/api/patients/${id}` : id;
    return lastValueFrom( this.apollo.query({
      query: queries.user.getByIdSimple(),
      variables: {id: patient_id}
    }));
  }
  async updateUser(variables: any): Promise<any> {
    return lastValueFrom(this.apollo.mutate({
      mutation: mutations.user.update(),
      variables
    }));
  }
}
