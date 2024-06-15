import {Injectable} from '@angular/core';
import {ExercisestHTTP} from '../repos/exercises-repo-http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExercisesService {

  exercises: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([]);
  constructor(
    private exercisestHTTP: ExercisestHTTP) {
  }

  get myExercises() {
    return this.exercises;
  }

  getMyExercises$(): Observable<Array<any>> {
    return this.exercises.asObservable();
  }

  async getExercises(variables:any) {
    try {
      const exercisesResponse = await this.exercisestHTTP.getExercises(variables);
      // @ts-ignore
      if (!exercisesResponse.errors) {
        // @ts-ignore
        return exercisesResponse.data.exercises;
      }
    } catch (e) {
      console.error(e);
      return throwError(e).toPromise();
    }
  }

  async getExercise(id: string) {
    try {
      const exerciseResponse = await this.exercisestHTTP.getExercise(id);
      // @ts-ignore
      if (!exerciseResponse.errors) {
        // @ts-ignore
        return exerciseResponse.data.exercise;
      }
    } catch (e) {
      console.error(e);
      return throwError(e).toPromise();
    }
  }

  async createFinish(variables: any) {
    try {
      const createFinishedExerciseResponse = await this.exercisestHTTP.createFinish(variables);
      // @ts-ignore
      if (!createFinishedExerciseResponse.errors) {
        // @ts-ignore
        return createFinishedExerciseResponse.data.createFinishedExercise;
      }
    } catch (e) {
      console.error(e);
    }
  }

  async updatedFinish(variables: any) {
    try {
      const updatedFinishedExerciseResponse = await this.exercisestHTTP.updatedFinish(variables);
      // @ts-ignore
      if (!updatedFinishedExerciseResponse.errors) {
        // @ts-ignore
        return updatedFinishedExerciseResponse.data.updateFinishedExercise;
      }
    } catch (e) {
      console.error(e);
    }
  }
}
