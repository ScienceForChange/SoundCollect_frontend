import { CommonModule, NgClass } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Marker } from '@capacitor/google-maps';
import { IonRange, IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ITrack } from 'src/app/models/itrack';
import { ComponentsModule } from 'src/app/pipes/components.module';
import { Howl, Howler } from 'howler';
import { MarkerCallbackData } from '@capacitor/google-maps/dist/typings/definitions';
import { pause } from 'ionicons/icons';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { IMarker } from 'src/app/models/imarker';
import { CommonService } from 'src/app/services';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss'],
  standalone: true,
  imports: [
    NgClass,
    IonicModule,
    CommonModule,
    ComponentsModule,
    TranslateModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PopUpPage implements OnInit {

  @Input() marker: MarkerCallbackData;
  player: Howl | null = null;
  private track: ITrack;
  private path_: string = '';
  isPlaying = false;
  progress: number = 0;
  duration: number;
  markers: IMarker[] = [];
  @ViewChild('range', { static: false }) range: IonRange;

  constructor(
    private modalCtl: ModalController, private commonService: CommonService
  ) {
    this.track = { name: '', path: '' }
  }

  async ngOnInit() {
    const result = await this.commonService.getItem("markers");
    if (result != null) {
      this.markers = JSON.parse(result);
    }

    let item = this.markers.filter(mark => {
      console.log(mark);
      if (mark.coordinate.lat === this.marker.latitude && mark.coordinate.lng === this.marker.longitude) {
        return mark;
      } else {
        return null
      }
    });
    if (item) {
      console.log(item);
      this.track.name = item[0].track.name;
      this.track.path = item[0].track.path;
    }
  }
  // async getPath(track: ITrack): Promise<string> {
  //   const path = await Filesystem.getUri({
  //     directory: Directory.Data,
  //     path: track.name
  //   });
  //   this.path_ = path.uri.toString();
  // }

  async start(pause: any) {
    await Filesystem.getUri({
      directory: Directory.Data,
      path: this.track.name
    }).then((result) => {
      this.path_ = Capacitor.convertFileSrc(result.uri);
    });
    // this.path_ = path.uri.toString();
    console.log(this.path_);
    if (!this.player) {
      this.player = new Howl({
        src: [
          this.path_
        ],
        html5: true,
        onplay: () => {
          this.isPlaying = true;
          this.updateProgress();
          this.duration = this.player?.duration() ?? 0;
        },
        onend: () => { }
      });
    }
    this.isPlaying = !pause;
    if (pause) {
      this.player?.pause();
    } else {
      this.player?.play();
    }
  }

  // togglePlayer(pause: any) {
  //   this.isPlaying = !pause;
  //   if (pause) {
  //     this.player?.pause();
  //   } else {
  //     this.player?.play();
  //   }
  // }

  dismiss() {
    this.modalCtl.dismiss();
    this.player?.stop();
  }

  seek() {
    let newValue: any = this.range?.value ?? 0;
    let duration = this.player?.duration() ?? 0;
    this.player?.seek(duration * (newValue / 100));
  }

  updateProgress() {
    let seek: number = this.player?.seek() ?? 0;
    let duration = this.player?.duration() ?? 0;
    this.progress = (seek / duration) * 100 || 0;
    this.duration = Math.round(this.progress - duration);
    setTimeout(() => {
      this.updateProgress();
    }, 100);
  }
}
