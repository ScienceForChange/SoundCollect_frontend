import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import { RouterLink } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';
import {CommonService} from "../../services";

@Component({
  selector: 'app-calibrate-done',
  templateUrl: './calibrate-done.page.html',
  styleUrls: ['./calibrate-done.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule]
})
export class CalibrateDonePage implements OnInit {
  navController = inject(NavController);
  commonService = inject(CommonService);

  constructor() { }

  async ngOnInit() {
    await this.commonService.setItem('calibrateDone', 'true');
  }

  goBack() {
    this.navController.back();
  }

  async goToHome() {
    await this.navController.navigateForward('tabs/home');
  }

}
