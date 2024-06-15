import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/services/user-service';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { HttpClient } from '@angular/common/http';
import { CommonService } from 'src/app/services';

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
        this.selectedLanguage = 'es';
      }
    });
  }

  guardarCambioIdioma() {
    this.common.setItem('locale', this.selectedLanguage);
    this.translate.use(this.selectedLanguage);
    this.navCtrl.back();
  }
}
