import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit, ViewChild } from '@angular/core';
import {DatePipe, NgClass, NgForOf, NgOptimizedImage} from "@angular/common";
import {IonicModule, ModalController, NavController} from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { IonModal } from '@ionic/angular/common';
import {ObservationDetailsPage} from "../../pages/observation-details/observation-details.page";
@Component({
  selector: 'app-my-sounds',
  templateUrl: './my-sounds.component.html',
  styleUrls: ['./my-sounds.component.scss'],
  imports: [
    NgClass,
    IonicModule,
    TranslateModule,
    DatePipe,
    NgOptimizedImage,
    NgForOf
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})
export class MySoundsComponent implements OnInit {
  myDb: number = 0;
  types: [];
  @Input() itemSound: any;
  @ViewChild(IonModal) modal: IonModal;

  constructor(private modalCtl: ModalController) {
  }

  async ngOnInit() {
    this.myDb = parseInt(this.itemSound?.attributes?.Leq);
  }

  async goToDetails(item: any) {
    const modal = await this.modalCtl.create({
      component: ObservationDetailsPage,
      cssClass: 'full-size-modal',
      componentProps: {
        state: {id: item.id}
      },
    });
    await modal.present();
  }
}
