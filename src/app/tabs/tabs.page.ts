import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { NgIf, NgOptimizedImage } from "@angular/common";
import { RouterLink } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonicModule, NgIf, RouterLink, TranslateModule, NgOptimizedImage]
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  navController = inject(NavController);
  constructor() {
  }

  ngOnInit() {
  }

  async goto() {
    await this.navController.navigateRoot('collect-sound');
  }
}
