import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import { mutations } from '../_graphql/_mutations';
import {queries} from '../_graphql/_queries';

@Injectable()
export class ExercisestHTTP {

  constructor(
    private apollo: Apollo) {
  }

  async getExercises(variables: any) {
    return await this.apollo.query({
      query: queries.exercises.getAll(),
      variables
    }).toPromise();
  }

  async getExercise(id: string) {
    return await this.apollo.query({
      query: queries.exercises.getById(),
      variables: {
        id
      }
    }).toPromise();
  }

  async createFinish(variables: any) {
    return await this.apollo.mutate({
      mutation: mutations.exercises.createFinishedExercise(),
      variables
    }).toPromise();
  }

  async updatedFinish(variables: any) {
    return await this.apollo.mutate({
      mutation: mutations.exercises.updateFinishedExercise(),
      variables
    }).toPromise();
  }
}
