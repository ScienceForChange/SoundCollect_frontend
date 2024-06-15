import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, NavController } from '@ionic/angular';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { CommonService } from 'src/app/services';
import { TranslateModule } from '@ngx-translate/core';
import { Swiper } from "swiper";
import { Navigation, Pagination } from 'swiper/modules';
import { GraphComponent } from "../../components/graph/graph.component";
import { ParseFloatPipe } from 'src/app/pipes/format-str2float.pipe';
import { ComponentsModule } from 'src/app/pipes/components.module';

@Component({
  selector: 'app-observation-details',
  templateUrl: './observation-details.page.html',
  styleUrls: ['./observation-details.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule, NgOptimizedImage, GraphComponent, ComponentsModule],
  providers: [ObservationsRepoHttp, ObservationsService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ObservationDetailsPage implements OnInit {
  private observationsService = inject(ObservationsService);
  private commonService = inject(CommonService);
  private navParams = inject(NavParams);
  private modalCtl = inject(ModalController);
  // init Swiper:
  swiper = new Swiper('.swiper', {
    // configure Swiper to use modules
    modules: [Navigation, Pagination],
  });

  id: string | null = null;
  observation: any = {};
  showGraph = false;
  constructor() {
  }

  async ngOnInit() {
    let nav = this.navParams.get('state');
    nav = nav.id
    if (nav) {
      this.id = nav;
      await this.getObservationByUUID();
    }
  }

  async getObservationByUUID(): Promise<any> {
    if (this.id) {
      //await this.commonService.showLoader();
      await this.observationsService.getObservationByUUID(this.id).then(async (result) => {
        this.observation = result?.data;
        this.showGraph = true;
        console.log(this.observation);
      })
        .catch(async (error) => {
          console.log(error);
          await this.commonService.hideLoader()
        })
        .finally(async () => await this.commonService.hideLoader());
    }
  }
  async goBack() {
    await this.modalCtl.dismiss('closed');
  }
}
