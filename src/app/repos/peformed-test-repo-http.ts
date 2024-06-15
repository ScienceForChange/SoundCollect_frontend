import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import { mutations } from '../_graphql/_mutations';

@Injectable()
export class PerformedTestHTTP {
  constructor(
    private apollo: Apollo) {
  }

  async createFinishedTest(variables: any) {
    return await this.apollo.mutate({
      mutation: mutations.finishTest.createFinishedTest(),
      variables
    }).toPromise();
  }

  async createAnswerTest(variables: any) {
    return await this.apollo.mutate({
      mutation: mutations.answer.create(),
      variables
    }).toPromise();
  }
}
