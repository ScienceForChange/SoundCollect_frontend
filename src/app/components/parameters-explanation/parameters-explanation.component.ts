import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { IonModal, IonButton, IonicModule } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-parameters-explanation',
  templateUrl: './parameters-explanation.component.html',
  styleUrls: ['./parameters-explanation.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule,
    NgOptimizedImage
  ]
})
export class ParametersExplanationComponent implements OnInit {

  open = false;
  @Input() buttonTextColor="primary"
  ngOnInit(): void {

  }
  close() {
    this.open = false;
  }
  onWillDismiss(event: Event) {
    this.close();
  }
  openSecondModal() {
    this.open = true;
  }
}