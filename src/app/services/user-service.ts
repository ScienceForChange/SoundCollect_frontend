import { UserHTTP } from '../repos/user-repo-http';
import { Injectable } from '@angular/core';
import { ObservationsService } from './observations.service';
import moment from 'moment/moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private showGamificationNotification = false;
  constructor(private userHTTP: UserHTTP, private observationService: ObservationsService) {
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
  async userGamificationPoints() {
    let points = 0;
    let sameDayExtraPoints = { day: '1970-01-01', used: false };
    const res = await this.observationService.getMyObservations();
    if (res.status === 'success') {
      res.data.forEach((observationData: any) => {
        if (observationData.attributes.images) {
          points += 2;
        } else {
          points += 1;
        }
        const date1 = moment(sameDayExtraPoints.day);
        const date2 = moment(observationData.attributes.created_at);
        if (date1.isSame(date2, 'day')) {
          if (!sameDayExtraPoints.used) {
            points += 3;
            sameDayExtraPoints.used = true;
          }
        } else {
          sameDayExtraPoints = { day: observationData.attributes.created_at, used: false };
        }
      });
    }
    return points;
  }
  async isExpert() {
    const points = await this.userGamificationPoints();
    if (points >= 21) return true;
    return false;
  }
  async gamificationLevel(totalPoints?: number) {
    const points = totalPoints ? totalPoints : await this.userGamificationPoints();

    if (points > 20) {
      return 5;
    } else if (points > 12) {
      return 4;
    } else if (points > 6) {
      return 3;
    } else if (points > 2) {
      return 2;
    } else if (points > 0) {
      return 1;
    } else {
      return 0;
    }
  }
  gamificationCalcProgressBar(totalPoints: number) {
    return +(totalPoints / 21).toFixed(2);
  }
  
  public set notificationGaming(show: boolean) {
    this.showGamificationNotification = show;
  }

  public get notificationGaming() {
    return this.showGamificationNotification;
  }
}
