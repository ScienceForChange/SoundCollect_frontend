import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonRange, NavController } from '@ionic/angular';
import { NavigationExtras, Router, RouterLink } from "@angular/router";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { VoiceRecorder, RecordingData } from 'capacitor-voice-recorder';
import { LocationService } from 'src/app/services/location.service';
import { IMarker } from 'src/app/models/imarker';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AuthService, CommonService } from 'src/app/services';
import { Subscription, interval } from 'rxjs';
import { ObservationsService } from 'src/app/services/observations.service';
import { ObservationsRepoHttp } from 'src/app/repos/observations-repo-http';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { Howl } from 'howler';
import audioBufferToWav from 'audiobuffer-to-wav';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { IRecordResponse } from 'src/app/models/irecord';
import { IObservation } from 'src/app/models/iobservation';
import { NoUserAuthComponent } from "../../components/no-user-auth/no-user-auth.component";
import { GraphComponent } from "../../components/graph/graph.component";
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Timer } from "../../utils/timer";
import { UserService } from 'src/app/services/user-service';
import { UserHTTP } from 'src/app/repos/user-repo-http';


@Component({
  selector: 'app-collect-sound',
  templateUrl: './collect-sound.page.html',
  styleUrls: ['./collect-sound.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink, TranslateModule, NgOptimizedImage, NoUserAuthComponent, GraphComponent],
  providers: [
    AndroidPermissions,
    LocationService,
    Geolocation,
    NativeGeocoder,
    ObservationsService, ObservationsRepoHttp, UserService, UserHTTP
  ]
})
export class CollectSoundPage implements OnInit {
  private navController = inject(NavController);
  private locationService = inject(LocationService);
  private commonService = inject(CommonService);
  private observationsService = inject(ObservationsService);
  translate = inject(TranslateService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);
  recording = false;
  stoped = true;
  flagViewControls = false;
  storedFileNames: any[] = [];
  marker: IMarker;
  comentario = '';
  timer: string = '00:00:00';
  timerSubscription: Subscription; // La suscripción al timer
  seconds: number = 0; // Segundos transcurridos
  maxSeconds: number = 31 //Máximo de segundos a grabar
  soundRecorded: any;
  soundRecordedBlob: any;
  soundRecordResponse: IRecordResponse;
  @ViewChild("fileUpload", { static: false }) fileUpload: ElementRef;
  fileList: any[] = [];
  fileListUrl: string[] = [];
  observation: IObservation = {
    Leq: undefined,
    LAeqT: undefined,
    LAmax: undefined,
    LAmin: undefined,
    L90: undefined,
    L10: undefined,
    sharpness_S: undefined,
    loudness_N: undefined,
    roughtness_R: undefined,
    fluctuation_strength_F: undefined,
    images: [],
    latitude: "",
    longitude: "",
    sound_types: [],
    quiet: "",
    cleanliness: "",
    accessibility: "",
    safety: "",
    influence: "",
    landmark: "question_removed",
    protection: "",
    pleasant: "",
    chaotic: "",
    vibrant: "",
    uneventful: "",
    calm: "",
    annoying: "",
    eventful: "",
    monotonous: "",
    environment: "",
    path: ""
  };
  player: Howl | null = null;
  private path_: string = '';
  isPlaying = false;
  progress: number = 0;
  duration: number;
  @ViewChild('range', { static: false }) range: IonRange;
  audioUrl: string;
  temporizador: Timer;
  authService = inject(AuthService);
  dataset: any[] = [];
  showGraph = false;
  imagePanelVar: boolean = false;
  readonly jwtTokenName = 'jwt_token';
  isUserAuth: boolean;
  isExpert = false;

  constructor() {
    this.marker = {
      title: '',
      snippet: '',
      iconSize: { height: 35, width: 35 },
      coordinate: { lat: 0, lng: 0 },
      track: { name: '', path: '' }
    };
  }

  async ngOnInit() {
    const token = await this.commonService.getItem(this.jwtTokenName);
    if (token) {
      this.isUserAuth = true;
    }
    let dataNavigation = this.router.getCurrentNavigation()?.extras?.state;
    if (dataNavigation && dataNavigation['observation'] && dataNavigation['fileList']) {
      this.observation = dataNavigation['observation'];
      this.fileList = dataNavigation['fileList'];
      console.log("Datanavigation");
    } else {
      this.myStep = 1;
      await this.clearFilesSystem();
    }
    await VoiceRecorder.requestAudioRecordingPermission();
    //this.isExpert = await this.userService.isExpert();
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
    if (await VoiceRecorder.hasAudioRecordingPermission()) {
      await this.startRecordingPart2();
    } else {
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

  async resetRecording() {
    await this.clearFilesSystem();
    this.recording = false;
    this.stoped = true;
    this.resetTimer();
    await this.startRecording();
  }

  stopRecording() {
    if (!this.recording) {
      return;
    }
    this.recording = false;
    this.stoped = true;
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        const fileName = new Date().getTime() + '.wav';
        await Filesystem.writeFile({
          path: fileName,
          directory: Directory.Data,
          data: recordData
        });
        localStorage.setItem('audioName', fileName)
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
          })
          .catch((error) => {
            console.error('Error al decodificar el audio:', error);
          });

        this.stopTimer();

        //get current location

        if (this.observation.path) {
          const locationPath = JSON.parse(this.observation.path);
          this.marker.coordinate = locationPath[0];
          this.observation.latitude = locationPath[0].lat;
          this.observation.longitude = locationPath[0].lng;
        } else {
          const coordinates = (await this.locationService.getCoordinates())?.coords;
          if (!coordinates) {
            return;
          } else {
            this.marker.coordinate = {
              lat: coordinates?.latitude,
              lng: coordinates?.longitude
            }
          }
          this.observation.latitude = coordinates?.latitude;
          this.observation.longitude = coordinates?.longitude;
        }

        this.marker.title = this.comentario;
        this.marker.iconSize = { height: 35, width: 35 }
        this.marker.snippet = this.comentario;
        this.marker.track.name = fileName;
        this.marker.track.path = Directory.Data;

        const mkrs = await this.commonService.getItem("markers");
        let markers = [];
        if (mkrs != null) {
          markers = JSON.parse(mkrs);
        }
        markers.push(this.marker);
        await this.commonService.setItem("markers", JSON.stringify(markers));
      }
    });

  }


  async playFile(fileName: any) {
    const audioFile = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data
    });
    const base64Sound = audioFile.data;
    const audioRef = new Audio(`data:audio/aac;base64,${base64Sound}`);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }

  goBack() {
    this.navController.navigateBack('/tabs/home');
  }

  myStep = 1;
  boxContent: true;

  async next(myStep?: any) {
    if (myStep === 1) {
      const message = "loading_processing_sound";
      await this.commonService.showLoaderWithMsg(message);
      // Llamar al endpoint para procesar el audio
      let formData = new FormData();
      formData.append('audio', this.soundRecordedBlob, this.soundRecorded.name);
      this.observationsService.sendSound(formData).then(async (response: any) => {
        if (await response?.status === "success") {
          this.soundRecordResponse = response?.data;
          console.log(this.soundRecordResponse);
          this.copyRecordIntoObservation(this.soundRecordResponse, this.observation);
          this.showGraph = true;
        } else {
          // Hubo un error al guardar el archivo
          console.error('Error al guardar el archivo:', response.statusText);
        }
        await this.commonService.hideLoader();
      }).catch(error => {
        console.error('Error en la solicitud:', error);
        const description = this.translate.instant('global_error.label.error_ocurred');
        this.commonService.alertModal("", description);
        this.commonService.hideLoader();
      }).finally(() => {
        this.commonService.hideLoader();
      });
    } else if (this.myStep === 3) {
      try {
        await this.commonService.showLoader();
        this.isExpert = await this.userService.isExpert();
        await this.commonService.hideLoader();
      } catch (error) {
        console.log(error);
        await this.commonService.hideLoader();
      }
    }

    this.myStep++;
  }

  back() {
    this.myStep--;
  }

  // Función para iniciar el temporizador
  startTimer() {
    let pathCoords: any[] = [];
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.seconds === this.maxSeconds) {
        this.stopRecording();
      } else {
        setTimeout(async () => {
          if (this.seconds === 1 || this.seconds === 10 || this.seconds === 20 || this.seconds === 30) {
            const data = await this.locationService.getCoordinates();
            pathCoords.push({
              lat: data.coords.latitude,
              lng: data.coords.longitude
            });
            console.log(pathCoords);

            this.observation.path = JSON.stringify(pathCoords);
          }
        });
        const hours = Math.floor(this.seconds / 3600);
        const minutes = Math.floor((this.seconds % 3600) / 60);
        const seconds = this.seconds % 60;
        this.timer = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
        this.seconds++;
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

  // Función para resetear el temporizador
  resetTimer() {
    this.timer = "00:00:00";
    this.seconds = 0;
    this.recording = false;
    this.stoped = true;
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


  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  // Paso 2: play audio recorded
  async start(pause: any) {
    const fileName = localStorage.getItem('audioName');
    if (fileName) {
      await Filesystem.getUri({
        directory: Directory.Data,
        path: fileName
      }).then((result) => {
        this.path_ = Capacitor.convertFileSrc(result.uri);
      });
    }
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
          this.temporizador = new Timer(this.duration);
          this.temporizador.iniciar();
        },
        onend: () => {
        }
      });
    }
    this.isPlaying = !pause;
    if (pause) {
      this.player?.pause();
    } else {
      this.player?.play();
    }
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


  //upload images

  async addImages() {
    const fileUpload = this.fileUpload.nativeElement;
    const filteredFiles: any[] = [];
    fileUpload.onchange = () => {
      for (let i = 0; i < fileUpload.files.length; i++) {
        const file = fileUpload.files[i];


        const reader = new FileReader();
        // if ( file.size >= minSizeInBytes && file.size <= maxSizeInBytes) {
        reader.onload = (e: any) => {
          const img = new Image();
          const result = e.target?.result;
          if (typeof result === 'string')
            img.src = result;

          img.onload = () => {
            const width = img.width;
            const height = img.height;

            // if (width <= maxWidth && height <= maxHeight) {
            this.fileList.push(file);
            // }

          };

          // };
        }
        reader.readAsDataURL(file);
      }
      this.closeImagePane();
    };
    fileUpload.click();
  }

  getImgUrl(index: number): string {
    if (!this.fileListUrl[index]) {
      this.fileListUrl[index] = URL.createObjectURL(this.fileList[index]);
    }
    return this.fileListUrl[index];
  }

  deleteImage(index: number) {
    this.fileList.splice(index, 1);
    this.fileListUrl.splice(index, 1);
  }

  copyRecordIntoObservation(record: any, observation: any) {
    for (const key in record) {
      if (record.hasOwnProperty(key)) {
        observation[key] = record[key];
      }
    }
  }

  toggleCheckbox(opcion: number) {
    if (this.observation.sound_types?.includes(opcion)) {
      this.observation.sound_types = this.observation.sound_types.filter(item => item !== opcion);
    } else {
      this.observation.sound_types?.push(opcion);
    }
  }

  async resume() {
    await this.goToResume();
  }

  isValid() {
    return !!(this.observation.sound_types.length > 0 &&
      this.observation.quiet &&
      this.observation.cleanliness &&
      this.observation.accessibility &&
      this.observation.safety &&
      this.observation.influence &&
      this.observation.protection &&
      (!this.isExpert ||
        (this.observation.environment &&
          this.observation.pleasant &&
          this.observation.chaotic &&
          this.observation.vibrant &&
          this.observation.uneventful &&
          this.observation.calm &&
          this.observation.annoying &&
          this.observation.eventful &&
          this.observation.monotonous
        )
      )
    )
  }

  async goToResume() {
    const navigationExtras: NavigationExtras = {
      state: {
        observation: this.observation,
        fileList: this.fileList,
        isExpert: this.isExpert
      },
    };
    await this.clearFilesSystem();
    await this.navController.navigateForward('/results', navigationExtras);
  }

  async initRecord() {
    if (!this.recording) {
      await this.startRecording();
    }
  }

  async takePicture() {
    const hasPermission = await this.checkCameraPermission();
    if (!hasPermission) {
      await Camera.requestPermissions();
      console.log('No se tienen los permisos necesarios para acceder a la cámara');
      this.commonService.alertModal(this.translate.instant('sounds.collect.camera_permission'), 'Error');
      return; // Salir de la función si no hay permisos
    }
    try {
      await this.commonService.showLoader();
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Prompt,
        width: 600,
        resultType: CameraResultType.DataUrl,
        promptLabelHeader: this.translate.instant('sounds.collect.images'),
        promptLabelPhoto: this.translate.instant('sounds.collect.file_picker'),
        promptLabelPicture: this.translate.instant('sounds.collect.take_photo'),
      });

      const blob = await this.convertDataUrlToBlob(image.dataUrl);
      const file = new File([blob], 'captured_image.jpg', { type: 'image/jpeg' });
      this.fileList.push(file);

      await this.closeImagePane();
      await this.commonService.hideLoader();
    } catch (e) {
      console.log(e);
      await this.commonService.hideLoader();
    }
  }

  async convertDataUrlToBlob(dataUrl: string | undefined): Promise<Blob> {
    if (!dataUrl) {
      throw new Error('El Data URL es undefined.');
    }

    const base64String = dataUrl.split(',')[1]; // Eliminar el prefijo "data:image/jpeg;base64," del Data URL
    const byteCharacters = atob(base64String); // Convertir el string base64 a caracteres byte

    // Convertir los caracteres byte en un array de bytes
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }

    // Crear el Blob a partir del array de bytes
    return new Blob([byteArray], { type: 'image/jpeg' });
  }

  async checkCameraPermission() {
    const status = await Camera.checkPermissions();
    if (status.camera !== 'granted') {
      const permissionRequest = await Camera.requestPermissions({ permissions: ['camera'] });
      return permissionRequest.camera === 'granted';
    }
    return true;
  }

  openFilePicker() {
    this.fileUpload.nativeElement.click();
  }

  async showImagePane() {
    this.imagePanelVar = true;
  }
  async closeImagePane() {
    this.imagePanelVar = false;
  }
  noOrder() {
    return false
  }
}
