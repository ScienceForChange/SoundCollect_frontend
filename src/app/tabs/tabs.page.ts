import { Component, inject } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { NgIf, NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular/standalone';
import { CommonService } from "../services";
import { LocationService } from "../services/location.service";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, RouterLink, TranslateModule, NgOptimizedImage]
})
export class TabsPage {
  navController = inject(NavController);
  translate = inject(TranslateService);
  commonService = inject(CommonService);
  locationService = inject(LocationService);
  displayCuppertino = false;

  constructor(private toastController: ToastController) {
  }

  async presentWarningToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000, // Duración en milisegundos
      color: 'warning', // Color del toast
      position: 'top' // Posición del toast (top, bottom, middle)
    });
    await toast.present();
  }

  closeCuppertinoCalibration() {
    this.displayCuppertino = false;
  }

  openCuppertinoCalibration() {
    this.displayCuppertino = true;
  }

  async goToCalibration() {
    this.closeCuppertinoCalibration();
    await this.navController.navigateRoot('calibrate-sound');
  }

  async goToNewSound() {
    if (await this.locationService.checkAppPermissions()) {
      this.closeCuppertinoCalibration();
      await this.navController.navigateRoot('collect-sound');
    } else {
      await this.presentWarningToast(this.translate.instant('sounds.collect.location_permission'));
    }
  }

  async openCupertinoOrNewSound() {
    const res = await this.commonService.getItem('calibrateDone');
    if (res === 'true') {
      await this.goToNewSound();
    } else {
      this.openCuppertinoCalibration();
    }
  }
}
