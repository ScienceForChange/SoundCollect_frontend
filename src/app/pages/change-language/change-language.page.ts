import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterLink} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {UserService} from 'src/app/services/user-service';
import {UserHTTP} from 'src/app/repos/user-repo-http';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-change-language',
  templateUrl: './change-language.page.html',
  styleUrls: ['./change-language.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, FormsModule, RouterLink, TranslateModule],
  providers: [HttpClient, UserService, UserHTTP]
})
export class ChangeLanguagePage implements OnInit {

  constructor() {
  }

  async ngOnInit() {

  }

}
