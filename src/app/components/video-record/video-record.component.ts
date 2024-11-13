import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  selector: 'app-video-record',
  templateUrl: './video-record.component.html',
  styleUrls: ['./video-record.component.scss'],
  imports: [
    IonicModule,
    TranslateModule
  ]
})
export class VideoRecordComponent {

  constructor() {
  }

}
