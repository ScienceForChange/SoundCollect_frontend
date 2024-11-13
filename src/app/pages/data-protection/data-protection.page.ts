import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.page.html',
  styleUrls: ['./data-protection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DataProtectionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
