import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from "@angular/router";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-greets',
  templateUrl: './greets.page.html',
  styleUrls: ['./greets.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink, TranslateModule]
})
export class GreetsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
