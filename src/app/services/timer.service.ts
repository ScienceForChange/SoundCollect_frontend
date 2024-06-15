import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  startTimer=new BehaviorSubject<number>(0);
  constructor() {}

  startRestTimer(time:number){
    this.startTimer.next(time);
  }
  stopRestTimer(){
    this.startTimer.next(0);
  }
}
