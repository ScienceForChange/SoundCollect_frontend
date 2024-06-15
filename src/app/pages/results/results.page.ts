import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AlertController, IonicModule, NavController} from '@ionic/angular';
import { Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IObservation } from 'src/app/models/iobservation';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { CommonService } from "../../services";
import { image } from 'ionicons/icons';
import {GraphComponent} from "../../components/graph/graph.component";

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule, NgOptimizedImage, GraphComponent],
  providers: [ObservationsService, ObservationsRepoHttp]
})
export class ResultsPage implements OnInit {
  private navController = inject(NavController);
  private router = inject(Router);
  private observationsService = inject(ObservationsService);
  translate = inject(TranslateService);
  commonService = inject(CommonService);
  dataNavigation: any;

  observation: IObservation;
  fileList: File[];

  constructor(private alertController: AlertController) { }

  ngOnInit() {
    this.dataNavigation = this.router.getCurrentNavigation()?.extras?.state;
    this.observation = this.dataNavigation.observation;
    this.fileList = this.dataNavigation.fileList;
    console.log('this.observation: ', this.observation);
  }

  async goBack() {
    const message = await this.translate.instant('sounds.results.alert');
    const btn_accept = await this.translate.instant('sounds.results.yes');
    const btn_cancel = await this.translate.instant('sounds.results.no');
    const alert = await this.alertController.create({
      header: message,
      mode: 'ios',
      buttons: [
        {
          text: btn_accept,
          handler: async () => {
            await this.navController.navigateForward("tabs/home", { animated: false });
          }
        },
        {
          text: btn_cancel,
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });
    await alert.present();

  }

  getImgUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  async sendObservation() {
    try {
      await this.commonService.showLoader();
      await this.observationsService.postObservation(this.observationToFormData(this.observation));
      await this.commonService.hideLoader();
      await this.navController.navigateForward("tabs/home", { animated: false });
    } catch (error) {
      const description = await this.translate.instant('global_error.label.message');
      this.commonService.alertModal("", description);
      await this.commonService.hideLoader();
      console.error("Error al enviar la observación: ", error);
    }
  }

  observationToFormData(object: any) {
    const formData = new FormData();

    for (const clave in object) {
      if (clave !== 'images' && clave !== 'sound_types' && object.hasOwnProperty(clave)) {
        formData.append(clave, object[clave]);
      }
    }

    for (let i = 0; i < this.observation.sound_types.length; i++) {
      formData.append(`sound_types[${i}]`, this.observation.sound_types[i].toString());
    }

    for (let i = 0; i < this.fileList.length; i++) {
      const file = this.fileList[i];
      formData.append(`images[${i}]`, file);
    }

    return formData;
  }

}
