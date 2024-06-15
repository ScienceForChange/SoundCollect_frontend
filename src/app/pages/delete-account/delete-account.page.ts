import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterLink } from "@angular/router";
import { AuthService, CommonService } from 'src/app/services';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class DeleteAccountPage {
  private authService = inject(AuthService);
  private commonService = inject(CommonService);
  private navController = inject(NavController);

  async deleteProfile() {
    await this.commonService.showLoader();
    await this.authService.removeProfile().then(async () => {
      await localStorage.setItem('jwt_token', '');
      await this.commonService.hideLoader();
      this.navController.navigateRoot('login');
    }).finally(async () => {
      await this.commonService.hideLoader();
    })
  }
}
