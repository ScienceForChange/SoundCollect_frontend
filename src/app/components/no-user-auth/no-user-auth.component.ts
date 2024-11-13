import {Component, inject, OnInit} from '@angular/core';

import {IonicModule, NavController} from "@ionic/angular";
import { TranslateModule } from '@ngx-translate/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-no-user-auth',
  templateUrl: './no-user-auth.component.html',
  styleUrls: ['./no-user-auth.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    TranslateModule,
    NgOptimizedImage
  ]
})
export class NoUserAuthComponent implements OnInit {

  navController = inject(NavController);
  constructor() { }

  ngOnInit() {

  }

  async goToLogin() {
    await this.navController.navigateRoot('/login', {replaceUrl: true});
  }
}
