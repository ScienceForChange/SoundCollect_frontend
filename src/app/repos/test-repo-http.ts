import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import { queries } from '../_graphql/_queries';

@Injectable()
export class TestHTTP {

  constructor(
    private apollo: Apollo) {
  }

  async getTestById(variables: any) {
    return await this.apollo.query({
      query: queries.test.getById(),
      variables
    }).toPromise();
  }
}
