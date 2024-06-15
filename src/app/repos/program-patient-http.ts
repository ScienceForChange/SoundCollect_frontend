import { Injectable } from '@angular/core';
import { queries } from '../_graphql/_queries';
import { Apollo } from 'apollo-angular';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProgramPatientHTTP {

  constructor(
    private apollo: Apollo
  ) {
  }

  async programPatients(variables: any) {
    return await this.apollo.query({
      query: queries.programPatients.get(),
      variables
    }).toPromise();
  }
  /**
   * @param variables (id)
   */
  async getTotalAndProgressDays(variables: any): Promise<any> {
    return lastValueFrom(this.apollo.query({
      query: queries.programPatients.getTotalAndProgressDays(),
      variables
    }));
  }
  /**
   * @param variables (program_id)
   */
  async getRestByProgramId(variables: any): Promise<any> {
    return lastValueFrom(this.apollo.query({
      query: queries.programs.getRest(),
      variables
    }));
  }
  /**
   * @param variables (id)
   */
  async getProgramDescriptionByProgramId(variables: any): Promise<any> {
    return lastValueFrom(this.apollo.query({
      query: queries.programs.getProgramDescription(),
      variables
    }));
  }
}
