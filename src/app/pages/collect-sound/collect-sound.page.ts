import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import {step} from "@tensorflow/tfjs-core";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-collect-sound',
  templateUrl: './collect-sound.page.html',
  styleUrls: ['./collect-sound.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink]
})
export class CollectSoundPage implements OnInit {
  private navController = inject(NavController);
  constructor() { }

  ngOnInit() {
  }

  goBack() {
    this.navController.back();
  }

  protected readonly step = step;
  myStep=1;
  boxContent: true;

  next() {
    this.myStep++;
  }

  back() {
    this.myStep--;
  }
}
