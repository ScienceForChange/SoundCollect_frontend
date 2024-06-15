import { Component } from '@angular/core';
import {IonicModule, NavController} from '@ionic/angular';
import {RouterLink} from "@angular/router";
import {ComponentsModule} from "../pipes/components.module";
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {MySoundsComponent} from "../components/my-sounds/my-sounds.component";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule, RouterLink, ComponentsModule, DecimalPipe, NgForOf, NgIf, TranslateModule, MySoundsComponent]
})
export class Tab2Page {
  content=true;
  constructor(private navController: NavController) {
  }

  ngOnInit() {
  }

  goBack() {
    this.navController.back();
  }

}
