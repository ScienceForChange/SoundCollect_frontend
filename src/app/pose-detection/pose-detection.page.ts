import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule, Platform, ViewWillEnter} from '@ionic/angular';
import {PoseDetectionService} from "../services/pose-detection.service";

@Component({
  selector: 'app-pose-detection',
  templateUrl: './pose-detection.page.html',
  styleUrls: ['./pose-detection.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PoseDetectionPage implements ViewWillEnter {

  private PoseDetectorService: PoseDetectionService = inject(PoseDetectionService);
  videoElement: HTMLVideoElement;
  private readonly platform: Platform = inject(Platform);
  @ViewChild('liveVideo', { static: false }) videoElementRef: ElementRef;
  @ViewChild('canvasElement') canvasElementRef!: ElementRef<HTMLCanvasElement>;

  constructor() {
  }

  async ionViewWillEnter() {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: {ideal: this.platform.width()},
        height: {ideal: this.platform.height()},
        /*aspectRatio: { ideal: this.platform.width() / this.platform.height() },*/ // no es necesario
      }
    }).then(async stream => {
      this.videoElement = this.videoElementRef.nativeElement;
      this.videoElement.srcObject = stream;
      // La lista de exercises no es necesario aqui si pueden enviar por referencia el id del ejercicio a detectar
      const exercise = await this.PoseDetectorService.getExercisesList();
      await this.PoseDetectorService.predictPoseExercise(exercise[0].id, this.videoElement, this.canvasElementRef.nativeElement);
    });
  }

  videoPlay() {
    this.videoElementRef.nativeElement.play();
  }

  videoStop() {
    this.videoElementRef.nativeElement.pause();
  }
}
