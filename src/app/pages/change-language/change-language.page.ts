import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user-service';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { HttpClient } from '@angular/common/http';
import { CommonService, ToastPosition } from 'src/app/services';
import { ToastController } from '@ionic/angular/standalone';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.page.html',
  styleUrls: ['./change-language.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, FormsModule, RouterLink, TranslateModule],
  providers: [HttpClient, UserService, UserHTTP]
})
export class ChangeLanguagePage {
  selectedLanguage: string;
  sub!: Subscription;
  constructor(
    private translate: TranslateService,
    private common: CommonService,
    private navCtrl: NavController
  ) {
    // Obtener el idioma guardado en el almacenamiento local
    this.common.getItem('locale').then((lang) => {
      if (lang) {
        this.selectedLanguage = lang;
      } else {
        this.selectedLanguage = 'ca';
      }
    });
    this.sub = this.translate.onLangChange.subscribe(async (event: any) => {
      console.log("Cambió el idioma");
      const message = await this.translate.instant('language.label.changed');
      await this.common.presentToast("", message, "success", 2000, ToastPosition.top);
    });
  }
  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  async guardarCambioIdioma() {
    await this.common.setItem('locale', this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
    this.navCtrl.back();

  }
}
