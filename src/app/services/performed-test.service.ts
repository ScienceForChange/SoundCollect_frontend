import {Injectable} from '@angular/core';
import {PerformedTestHTTP} from '../repos/peformed-test-repo-http';

@Injectable({
  providedIn: 'root'
})
export class PerformedTestService {

  constructor(
    private performedTestHTTP: PerformedTestHTTP) {
  }

  async createFinishedTest(variables: any) {
    try {
      const finishedResponse = await this.performedTestHTTP.createFinishedTest(variables);
      // @ts-ignore
      if (!finishedResponse.errors) {
        // @ts-ignore
       return finishedResponse.data.createFinishedTest;
      }
    } catch (e) {
      console.error(e);
    }
  }


  async createAnswerTest(variables: any) {
    try {
      const createAnswerTestResponse = await this.performedTestHTTP.createAnswerTest(variables);
      // @ts-ignore
      if (!createAnswerTestResponse.errors) {
        // @ts-ignore
        return createAnswerTestResponse.data.createAnswer;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
