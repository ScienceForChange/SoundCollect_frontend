import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { NavigationExtras, Router, RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IObservation } from 'src/app/models/iobservation';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { CommonService, ToastPosition } from "../../services";
import { image } from 'ionicons/icons';
import { GraphComponent } from "../../components/graph/graph.component";
import { UserService } from 'src/app/services/user-service';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { ParametersExplanationComponent } from 'src/app/components/parameters-explanation/parameters-explanation.component';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule, NgOptimizedImage, GraphComponent, ParametersExplanationComponent],
  providers: [ObservationsService, ObservationsRepoHttp, UserService, UserHTTP]
})
export class ResultsPage implements OnInit {
  private navController = inject(NavController);
  private router = inject(Router);
  private observationsService = inject(ObservationsService);
  private userService = inject(UserService);
  translate = inject(TranslateService);
  commonService = inject(CommonService);
  dataNavigation: any;

  observation: IObservation;
  fileList: File[];
  fileListUrl: string[] = [];
  isExpert = false;

  constructor(private alertController: AlertController) { }

  async ngOnInit() {
    this.dataNavigation = this.router.getCurrentNavigation()?.extras?.state;
    this.observation = this.dataNavigation.observation;
    this.fileList = this.dataNavigation.fileList;
    this.isExpert = this.dataNavigation.isExpert;
  }

  async goExit() {
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
            await this.navController.navigateRoot("tabs/home", { animated: false });
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
  async goBack() {
    console.log('back');
    const navigationExtras: NavigationExtras = {
      state: {
        observation: this.observation,
        fileList: this.fileList
      },
    };
    await this.navController.navigateBack('/collect-sound', navigationExtras);
  }

  getImgUrl(index: number): string {
    if (!this.fileListUrl[index]) {
      this.fileListUrl[index] = URL.createObjectURL(this.fileList[index]);
    }
    return this.fileListUrl[index];
  }

  async sendObservation() {
    try {
      await this.commonService.showLoader();
      await this.observationsService.postObservation(this.observationToFormData(this.observation));
      this.userService.notificationGaming=true;
      await this.commonService.hideLoader();
      const message = await this.translate.instant('sounds.results.sended_ok');
      await this.commonService.presentToast("", message, "success", 2000, ToastPosition.top);
      await this.navController.navigateRoot("tabs/home", { animated: false });
    } catch (error) {
      const description = await this.translate.instant('sounds.results.sended_error');
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
  noOrder() {
    return false;
  }
}
