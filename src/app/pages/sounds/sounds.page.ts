import { Component, inject, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from "@angular/router";
import { ComponentsModule } from "../../pipes/components.module";
import { DecimalPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { MySoundsComponent } from "../../components/my-sounds/my-sounds.component";
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { AuthService, CommonService } from 'src/app/services';
import { NoUserAuthComponent } from "../../components/no-user-auth/no-user-auth.component";

@Component({
  selector: 'app-sounds',
  templateUrl: 'sounds.page.html',
  styleUrls: ['sounds.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, ComponentsModule, DecimalPipe, NgForOf, NgIf, TranslateModule, MySoundsComponent, NgOptimizedImage, NoUserAuthComponent],
  providers: [ObservationsService, ObservationsRepoHttp, CommonService]
})
export class SoundsPage implements OnInit {

  content = true;
  soundsCant = 0;
  authService = inject(AuthService);
  observations: Array<any>;
  observationsService = inject(ObservationsService);
  commonService = inject(CommonService);
  isUserAuth = false;
  jwtTokenName = 'jwt_token';

  constructor() {
  }

  async ngOnInit() {
    const token = await this.commonService.getItem(this.jwtTokenName);
    if (token) {
      this.isUserAuth = true;
      await this.getMyObservations();
    }
  }

  async getMyObservations() {
    await this.commonService.showLoader();
    await this.observationsService.getMyObservations().then(async (result) => {
      if (result?.status === 'success') {
        this.observations = result?.data;
        this.content = this.observations.length > 0;
        this.soundsCant = this.observations.length;
      }
    }).catch(async (error) => {
      console.log(error);
    }).finally(() => {
      this.commonService.hideLoader();
    })
  }

  sortObjects(order: string) {
    if (order === 'asc') {
      this.observations = this.sortByDateAsc();
    } else if (order === 'desc') {
      this.observations = this.sortByDateDesc();
    }else if (order === 'lessLeq') {
      this.observations = this.sortByLeqAsc();
    }else if (order === 'moreLeq') {
      this.observations = this.sortByLeqDesc();
    }
  }
  // Ordenar de forma ascendente (los más antiguos primero)
  sortByDateAsc() {
    return this.observations.sort((a, b) => new Date(a?.attributes?.created_at).getTime() - new Date(b?.attributes?.created_at).getTime());
  }

  // Ordenar de forma descendente (los más recientes primero)
  sortByDateDesc() {
    return this.observations.sort((a, b) => new Date(b?.attributes?.created_at).getTime() - new Date(a?.attributes?.created_at).getTime());
  }

  sortByLeqAsc() {
    return this.observations.sort((a, b) => +a?.attributes?.Leq - +b?.attributes?.Leq);
  }
  sortByLeqDesc() {
    return this.observations.sort((a, b) => +b?.attributes?.Leq - +a?.attributes?.Leq);
  }
}
