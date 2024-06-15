import { UserHTTP } from '../repos/user-repo-http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private userHTTP: UserHTTP) {
  }

  /**
   * This method is register in sync service for load the events
   */
  async initializeUserEvents() {
  }

  updateTest(id: string, value: string, detail: string) {
    return this.userHTTP.updateUserRecord(id, value, detail);
  }

  async createUserRecord(userRecordOptions: any): Promise<any> {
    const createUserRecordResponse = await this.userHTTP.createUserRecord(userRecordOptions);
    return createUserRecordResponse?.data?.createUserRecord?.userRecord;
  }
  async existUserRecord(variables: any): Promise<any> {
    try {
      const existUserRecordResponse = await this.userHTTP.existUserRecord(variables);
      return existUserRecordResponse.data;
    } catch (e: any) {
      console.error(e);
      throw new Error("Error: " + e);
    }
  }
  async getUserRecord(variables: any): Promise<any> {
    try {
      const userRecordResponse = await this.userHTTP.getUserRecord(variables);
      return userRecordResponse.data;
    } catch (e: any) {
      console.error(e);
      throw new Error("Error: " + e);
    }
  }
  async getUserByIdSimple(id: number | string) {
    try {
      const userResponse = await this.userHTTP.getUserByIdSimple(id);

      // @ts-ignore
      if (!userResponse.errors) {
        // @ts-ignore
        let user: any = userResponse.data.patient;
        return user;
      }
    } catch (e) {
      console.error(e);
    }
  }
  async updateUser(variables: any) {
    try {
      const userResponse = await this.userHTTP.updateUser(variables);
      if (!userResponse.errors) {
        return userResponse.data;
      }
    } catch (e: any) {
      throw new Error(("Error: " + e));
      console.error(e);
    }
  }
}
