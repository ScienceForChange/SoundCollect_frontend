import { CUSTOM_ELEMENTS_SCHEMA, Component, OnInit, inject } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
  standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, TranslateModule, NgOptimizedImage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrivacyPolicyPage implements OnInit {

  private navController = inject(NavController);
  constructor() { }

  ngOnInit() {
  }

  goBack() {
    this.navController.back();
  }

}
