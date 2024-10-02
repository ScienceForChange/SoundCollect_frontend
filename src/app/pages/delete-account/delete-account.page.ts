import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterLink } from "@angular/router";
import { AuthService, CommonService } from 'src/app/services';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule]
})
export class DeleteAccountPage {
  authService = inject(AuthService);
  commonService = inject(CommonService);
  translate = inject(TranslateService);
  alertController = inject(AlertController);

  constructor() { }

  async deleteProfile() {
    const message = await this.translate.instant('delete_popup.message');
    const btn_yes = await this.translate.instant('delete_popup.yes');
    const btn_no = await this.translate.instant('delete_popup.no');
    const error_msg = await this.translate.instant('delete_page.error');
    const success_msg = await this.translate.instant('delete_page.success');

    const alert = await this.alertController.create({
      header: message,
      mode: 'ios',
      buttons: [
        {
          text: btn_yes,
          handler: async () => {
             try {
               await this.commonService.showLoader();
               await this.authService.removeProfile();
               await this.authService.logout();
               await this.commonService.hideLoader();
               await this.commonService.presentNotification(success_msg, '', 'success');
            } catch (error) {
                console.error(error);
                await this.commonService.hideLoader();
                await this.commonService.presentNotification(error_msg, '', 'warning');
            }
          }
        },
        {
          text: btn_no,
          handler: () => {
            console.log('Confirm Cancel');
          }
        }
      ]
    });
    await alert.present();
  }
}
