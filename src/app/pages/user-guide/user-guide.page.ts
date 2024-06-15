import { Component, OnInit } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.page.html',
  styleUrls: ['./user-guide.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterLink, NgOptimizedImage]
})
export class UserGuidePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
