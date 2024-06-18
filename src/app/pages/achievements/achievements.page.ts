import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from "@ngx-translate/core";
import { RouterLink } from "@angular/router";
import { UserService } from 'src/app/services/user-service';
import { CommonService } from 'src/app/services';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.page.html',
  styleUrls: ['./achievements.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, RouterLink],
  providers: [UserService, UserHTTP, ObservationsService, ObservationsRepoHttp]
})
export class AchievementsPage implements OnInit {
  private userService = inject(UserService);
  private commonService = inject(CommonService);
  level = 0;
  progressBar = 0;
  points = 0;

  constructor() { }

  async ngOnInit() {
    await this.getPoints();
    this.level = await this.userService.gamificationLevel(this.points);
    //this.progressBar = this.userService.gamificationCalcProgressBar(this.points);
  }
  async getPoints() {
    try {
      await this.commonService.showLoader();
      this.points = await this.userService.userGamificationPoints();
      await this.commonService.hideLoader();
    } catch (error) {
      console.log(error);
      await this.commonService.showLoader();
    }
  }

}
