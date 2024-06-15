import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-create-profile',
  templateUrl: './create-profile.page.html',
  styleUrls: ['./create-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, RouterLink, NgOptimizedImage]
})
export class CreateProfilePage implements OnInit {
  myEye = ['eye', 'eye'];
  myType = ['password', 'password'];
  navController = inject(NavController);
  myNumbers:[number]=[1];
  constructor() {
    for (let i = 1920; i <= 3000; i++) {
      this.myNumbers.push(i)
    }
  }
  ngOnInit() {
  }
  changeImage(item: number) {
    if (this.myEye[item] === 'eye') {
      this.myEye[item] = 'eye_open';
      this.myType[item] = 'test';
    } else if (this.myEye[item] === 'eye_open') {
      this.myEye[item] = 'eye';
      this.myType[item] = 'password';
    }
  }

  goBack() {
    this.navController.back();
  }
}
