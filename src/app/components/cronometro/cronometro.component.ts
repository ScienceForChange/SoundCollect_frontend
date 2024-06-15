import { Component, inject, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { IonicModule } from "@ionic/angular";
import { TimerService } from 'src/app/services/timer.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule
  ]
})
export class CronometroComponent implements OnInit {
  radius: number = 100;
  seg: number = 0;
  timerService = inject(TimerService);
  sub!: Subscription;
  interval: any | null = null;
  translate = inject(TranslateService);

  constructor() { }

  ngOnInit() {
    //this.x = Number(this.segundos);
    //this.y=this.x
    this.sub = this.timerService.startTimer.subscribe((seg) => {
      console.log("Segundos: ", seg);

      this.seg = seg;
      if (seg === 0) {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
          console.log("Stop Cro");
        };
      } else {
        this.radius = 100;
        const radiusStep = Math.round((this.radius / seg) * 100) / 100;
        this.interval = setInterval(() => {
          this.seg = this.seg - 1;
          this.radius -= radiusStep;
          if (this.seg === 0 && this.interval) {
            this.radius = 0;
            clearInterval(this.interval);
            this.interval = null;
            this.timerService.stopRestTimer();
          }
        }, 1000);
      }

    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}
