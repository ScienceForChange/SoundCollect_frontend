import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonRange, NavController } from '@ionic/angular';
import { RouterLink } from "@angular/router";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
import { LocationService } from 'src/app/services/location.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService, CommonService, ToastPosition } from 'src/app/services';
import { Subscription, interval } from 'rxjs';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { Howl } from 'howler';
import audioBufferToWav from 'audiobuffer-to-wav';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NoUserAuthComponent } from "../../components/no-user-auth/no-user-auth.component";
import { GraphComponent } from "../../components/graph/graph.component";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-calibrate-sound',
  templateUrl: './calibrate-sound.page.html',
  styleUrls: ['./calibrate-sound.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink, TranslateModule, NgOptimizedImage, NoUserAuthComponent, GraphComponent],
  providers: [
    AndroidPermissions,
    LocationService,
    Geolocation,
    NativeGeocoder,
    ObservationsService, ObservationsRepoHttp
  ]
})
export class CalibrateSoundPage implements OnInit {
  private navController = inject(NavController);
  private commonService = inject(CommonService);
  translate = inject(TranslateService);
  observationsService = inject(ObservationsService);
  recording = false;
  stoped = true;
  flagViewControls = false;
  storedFileNames: any[] = [];
  timer: string = '00:00:00';
  timerSubscription: Subscription; // La suscripción al timer
  seconds: number = 0; // Segundos transcurridos
  maxSeconds: number = 12 //Máximo de segundos a grabar
  soundRecorded: any;
  soundRecordedBlob: any;
  myStep = 1;
  canSendAudio = true;
  private path_: string = '';
  progress: number = 0;
  duration: number;
  @ViewChild('range', { static: false }) range: IonRange;
  audioUrl: string;
  authService = inject(AuthService);
  readonly jwtTokenName = 'jwt_token';
  isUserAuth: boolean;
  checkManual = false;
  calibrateValueApi = 0;
  manualValueCalibration = 40;
  constructor() {
  }

  async ngOnInit() {
    const token = await this.commonService.getItem(this.jwtTokenName);
    if (token) {
      this.isUserAuth = true;
    }
    this.myStep = 1;
    await this.clearFilesSystem();
    await VoiceRecorder.requestAudioRecordingPermission();
  }

  async clearFilesSystem() {
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result => {
      let storedFileNamesTemp = result.files;
      storedFileNamesTemp.forEach(async (fileName) => {
        await Filesystem.deleteFile({
          path: fileName.name,
          directory: Directory.Data
        });
      });
    });
    this.storedFileNames = [];
  }

  async startRecording() {
    if ((await VoiceRecorder.hasAudioRecordingPermission()).value) {
      await this.startRecordingPart2();
    } else {
      const message = await this.translate.instant('sounds.collect.micro_permission');
      await this.commonService.presentToast("", message, "warning", 3000, ToastPosition.top);
      await VoiceRecorder.requestAudioRecordingPermission();
      await this.startRecordingPart2();
    }
  }

  async startRecordingPart2() {
    VoiceRecorder.startRecording().then(() => {
      this.recording = true;
      this.stoped = false;
      this.flagViewControls = true;
      this.startTimer();
    });
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }
    this.recording = false;
    this.stoped = true;
    this.canSendAudio = true;
    this.flagViewControls = false;
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        const fileName = new Date().getTime() + '.wav';
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        });
        // Convertir Blob a File
        // Decodificar el audio base64 a un ArrayBuffer
        const arrayBuffer = Uint8Array.from(atob(recordData), c => c.charCodeAt(0)).buffer;
        // Crear un AudioContext para trabajar con el audio
        const audioContext = new AudioContext();
        // Decodificar el ArrayBuffer a un AudioBuffer
        await audioContext.decodeAudioData(arrayBuffer)
          .then(async (audioBuffer: AudioBuffer) => {
            // Convertir el AudioBuffer a un archivo WAV
            const wav = audioBufferToWav(audioBuffer);
            // Crear un Blob a partir del ArrayBuffer
            const blob = new Blob([wav], { type: 'audio/wav' });
            this.soundRecordedBlob = blob;
            // Crear un archivo File a partir del Blob
            const audioFile = new File([blob], 'audio.wav', { type: 'audio/wav' });
            this.audioUrl = URL.createObjectURL(blob);
            this.soundRecorded = audioFile;
            // 'wav' ahora es un ArrayBuffer que contiene los datos del archivo WAV
            console.log('Audio audioFile:', audioFile);
            console.log('Blob:', this.soundRecordedBlob);
            await this.sendAudioToProcess();
          })
          .catch((error) => {
            console.error('Error al decodificar el audio:', error);
          });
        this.stopTimer();
      }
    });
  }

  isChecked(event: any) {
    this.checkManual = !!event.detail.checked;
  }


  async sendAudioToProcess() {
    const message = "loading_processing_sound";
    await this.commonService.showLoaderWithMsg(message);
    let formData = new FormData();
    formData.append('uploaded_file', this.soundRecordedBlob, this.soundRecorded.name);
    this.observationsService.calibrateSound(formData).then(async (response: any) => {
      if (await response?.calibrated_value) {
        this.calibrateValueApi = this.commonService.obtenerParteEntera(response.calibrated_value);
        this.myStep = 2;
      } else {
        const description = this.translate.instant('global_error.label.error_ocurred');
        this.commonService.alertModal("", description);
      }
      await this.commonService.hideLoader();
    }).catch(error => {
      const description = this.translate.instant('global_error.label.error_ocurred');
      this.commonService.alertModal("", description);
      this.commonService.hideLoader();
    }).finally(() => {
      this.commonService.hideLoader();
    });

  }
  async sendValueCalibration() {
    const message = "saving_data";
    await this.commonService.showLoaderWithMsg(message);
    const diffNumber = this.calibrateValueApi - this.manualValueCalibration;
    console.log('diffNumber:', diffNumber);
    this.observationsService.valueCalibration(diffNumber).then(async (response: any) => {
      console.log('responseeeeeee save dataaaa:', response);
      await this.goToCalibrationOk();
      console.error('Error al enviar el valor de la calibración:', response.statusText);
      await this.commonService.hideLoader();
    }).catch(error => {
      // console.error('Error al enviar el valor de la calibración 22222:', error);
      // const description = this.translate.instant('global_error.label.error_ocurred');
      // this.commonService.alertModal("", description);
      this.commonService.hideLoader();
      this.goToCalibrationOk();
    }).finally(() => {
      this.commonService.hideLoader();
    });
  }

  // Función para iniciar el temporizador
  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      const hours = Math.floor(this.seconds / 3600);
      const minutes = Math.floor((this.seconds % 3600) / 60);
      const seconds = this.seconds % 60;
      this.timer = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
      this.seconds++;
      if (this.seconds === this.maxSeconds) {
        this.seconds = 0;
        this.stopRecording();
      }
    });
  }

  // Función para detener el temporizador
  stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      if (this.seconds < 1) {
        this.seconds = 0; // Reiniciar el temporizador a cero
        this.timer = '00:00:00'; // Reiniciar la visualización del temporizador
      }
    }
  }

  // Formatear el tiempo con dos dígitos
  formatTime(time: number): string {
    return time < 10 ? `0${time}` : `${time}`;
  }

  // Al destruir el componente, se detiene el temporizador
  async ngOnDestroy() {
    this.stopTimer();
    await this.clearFilesSystem();
  }

  async initRecord() {
    if (!this.recording) {
      await this.startRecording();
    }
  }

  async goToHome() {
    await this.navController.navigateRoot('/tabs/home');
  }

  async goToCalibrationOk() {
    await this.navController.navigateRoot('/calibrate-done');
  }

}
