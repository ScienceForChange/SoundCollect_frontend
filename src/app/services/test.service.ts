import {Injectable} from '@angular/core';
import {TestHTTP} from '../repos/test-repo-http';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  test: any;
  constructor(
    private testHTTP: TestHTTP) {
  }

  get getTest() {
    return this.test;
  }

  async getTestById(variables: any) {
    try {
      const testResponse = await this.testHTTP.getTestById(variables);
      // @ts-ignore
      if (!testResponse.errors) {
        // @ts-ignore
        const result = testResponse.data.test;
        const questions  = [...result.questions.collection];
        //TODO: Reorder by question
        questions.sort((q1, q2) => q1.questionOrder - q2.questionOrder);
        this.test = {...result, questions: {collection: questions} };
        return this.test;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
