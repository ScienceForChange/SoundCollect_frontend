import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonicModule, NavController} from '@ionic/angular';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class ResultsPage implements OnInit {
  private navController = inject(NavController);
  constructor() { }

  ngOnInit() {
  }

  goBack() {
    this.navController.back();
  }
}
