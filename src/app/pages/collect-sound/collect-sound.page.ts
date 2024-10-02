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
import { AuthService, CommonService, ToastPosition } from 'src/app/services';
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
import { ParametersExplanationComponent } from 'src/app/components/parameters-explanation/parameters-explanation.component';
import { SpectralGraphComponent } from 'src/app/components/spectral-graph/spectral-graph.component';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';


@Component({
  selector: 'app-collect-sound',
  templateUrl: './collect-sound.page.html',
  styleUrls: ['./collect-sound.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterLink, TranslateModule, NgOptimizedImage, NoUserAuthComponent, GraphComponent, ParametersExplanationComponent, SpectralGraphComponent],
  providers: [
    AndroidPermissions,
    LocationService,
    Geolocation,
    NativeGeocoder,
    ObservationsService, ObservationsRepoHttp, UserService, UserHTTP, Insomnia
  ]
})
export class CollectSoundPage implements OnInit {
  private navController = inject(NavController);
  private locationService = inject(LocationService);
  private commonService = inject(CommonService);
  private observationsService = inject(ObservationsService);
  private authService = inject(AuthService);
  translate = inject(TranslateService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private userService = inject(UserService);
  private insomnia = inject(Insomnia);
  recording = false;
  stoped = true;
  flagViewControls = false;
  storedFileNames: any[] = [];
  marker: IMarker;
  comentario = '';
  timer: string = '00:00:00';
  timerSubscription: Subscription; // La suscripción al timer
  seconds: number = 0; // Segundos transcurridos
  maxSeconds: number = 1800 //Máximo de segundos a grabar
  minSeconds: number = 30 //Mínimo de segundos a grabar
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
    overall: "",
    path: "",
    segments: []
  };
  player: Howl | null = null;
  private path_: string = '';
  isPlaying = false;
  progress: number = 0;
  duration: number;
  @ViewChild('range', { static: false }) range: IonRange;
  audioUrl: string;
  temporizador: Timer;
  dataset: any[] = [];
  showGraph = false;
  imagePanelVar: boolean = false;
  readonly jwtTokenName = 'jwt_token';
  isUserAuth: boolean;
  isExpert = false;
  autocalibration = 0;
  segments: any[] = [];
  blobs: Blob[] = [];
  audios64: string[] = [];
  pathCoords: { lat: number, lng: number }[] = [];
  recordInterval = 10;//Intervalo de grabación de sonidos
  sendingSounds = 0;

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
    await this.getAutocalibration();
    let dataNavigation = this.router.getCurrentNavigation()?.extras?.state;
    if (dataNavigation && dataNavigation['observation'] && dataNavigation['fileList']) {
      this.observation = dataNavigation['observation'];
      this.fileList = dataNavigation['fileList'];
    } else {
      this.myStep = 1;
      await this.clearFilesSystem();
    }
    await VoiceRecorder.requestAudioRecordingPermission();
    this.isExpert = await this.userService.isExpert();
  }

  async getAutocalibration() {
    try {
      const user = await this.authService.getUser();
      if (user.status === "success") {
        this.autocalibration = user.data.attributes.autocalibration
      }
    } catch (error) {
      console.log(error);
    }
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
    const hasPermimission = await VoiceRecorder.hasAudioRecordingPermission();
    if (hasPermimission.value) {
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

  async resetRecording() {
    await this.clearFilesSystem();
    if (!this.stoped) {
      await VoiceRecorder.stopRecording();
    }
    this.pathCoords = [];
    this.segments = [];
    this.blobs = [];
    this.resetTimer();
    await this.startRecording();
  }

  async stopRecording() {
    try {
      if ((!this.recording && (await VoiceRecorder.getCurrentStatus()).status !== "PAUSED")) {
        console.log("No STOP");
        return;
      }
      if (this.seconds % this.recordInterval > 1 || this.seconds === this.maxSeconds) {
        await this.commonService.showLoader();
        this.recording = false;
        this.stoped = true;
        const result = await VoiceRecorder.stopRecording();
        this.stopTimer();

        const data = await this.locationService.getCoordinates();
        this.pathCoords.push({
          lat: data.coords.latitude,
          lng: data.coords.longitude
        });
        this.observation.path = JSON.stringify(this.pathCoords);
        await this.processAudio(result);
        const audiFileName = new Date().getTime() + '.wav';
        await Filesystem.writeFile({
          path: audiFileName,
          directory: Directory.Data,
          data: this.audios64[0]
        });
        localStorage.setItem('audioName', audiFileName);
        console.log(this.segments);

        await this.commonService.hideLoader();
      }
    } catch (error) {
      console.log(error);
      await this.commonService.hideLoader();
    }
  }
  async pauseRecording() {
    await VoiceRecorder.pauseRecording();
    this.recording = false;
    this.stoped = false;
    this.stopTimer();
  }
  async resumeRecording() {
    console.log("Resume");

    await VoiceRecorder.resumeRecording();
    this.recording = true;
    this.stoped = false;
    this.startTimer();
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

  async goBack() {
    this.insomnia.allowSleepAgain();
    (!this.stoped || (await VoiceRecorder.getCurrentStatus()).status === "PAUSED") && await VoiceRecorder.stopRecording();
    this.flagViewControls = false;
    await this.clearFilesSystem();
    this.resetTimer();
    this.navController.navigateBack('/tabs/home');
  }

  myStep = 1;
  boxContent: true;

  async next(myStep?: any) {
    if (myStep === 1) {
      const message = "loading_processing_sound";
      await this.commonService.showLoaderWithMsg(message);
      if (!this.stoped) await this.stopRecording();


      let LAeqT: number[] = [];
      let sharpness_S = 0;
      let loudness_N = 0;
      let fluctuation_strength_F = 0;
      this.segments.forEach((segment: any) => {
        LAeqT.push(...segment.LAeqT);
        sharpness_S += segment.sharpness;
        loudness_N += segment.loudness;
        fluctuation_strength_F += segment.fluctuation;
        let el = { ...segment, LAmax: segment.Lmax, LAmin: segment.Lmin, LAeq: segment.Leq }
        delete el.Lmax;
        delete el.Lmin;
        delete el.Leq;
        delete el.fluctuation;
        delete el.loudness;
        delete el.roughness;
        delete el.sharpness;
        this.observation.segments.push(el);
      });

      const { L90, L10 } = this.calculateL10L90([...LAeqT])
      this.soundRecordResponse = {
        Leq: this.calculateLAeq(LAeqT),
        LAeqT: LAeqT,
        LAmax: Math.max(...LAeqT),
        LAmin: Math.min(...LAeqT),
        L90: L90,
        L10: L10,
        sharpness_S: parseFloat((sharpness_S / this.segments.length).toFixed(5)),
        loudness_N: parseFloat((loudness_N / this.segments.length).toFixed(5)),
        fluctuation_strength_F: parseFloat((fluctuation_strength_F / this.segments.length).toFixed(5))
      }
      this.copyRecordIntoObservation(this.soundRecordResponse, this.observation);
      this.observation.latitude = this.pathCoords[0].lat;
      this.observation.longitude = this.pathCoords[0].lng;
      this.showGraph = true;
      this.commonService.hideLoader();
    } else if (this.myStep === 3) {
      try {
        await this.commonService.showLoader();
        //this.isExpert = await this.userService.isExpert();
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

    this.timerSubscription = interval(1000).subscribe(() => {
      let hours = Math.floor(this.seconds / 3600);
      let minutes = Math.floor((this.seconds % 3600) / 60);
      let seconds = this.seconds % 60;
      this.timer = `${this.formatTime(hours)}:${this.formatTime(minutes)}:${this.formatTime(seconds)}`;
      if (this.seconds === this.maxSeconds) {
        this.stopRecording();
      } else {
        const actualSec = this.seconds;
        setTimeout(async () => {
          if (actualSec % this.recordInterval === 0) {
            const data = await this.locationService.getCoordinates();
            this.pathCoords.push({
              lat: data.coords.latitude,
              lng: data.coords.longitude
            });
            this.observation.path = JSON.stringify(this.pathCoords);
            actualSec !== 0 && await this.sendEvery10S(actualSec);
          }
        });

        this.seconds++;
      }
    });
  }
  //enviar sonido cada 10 seg
  async sendEvery10S(second: number) {
    try {
      const index = Math.floor(second / this.recordInterval) - 1;
      const result = await VoiceRecorder.stopRecording();
      !this.stoped && await VoiceRecorder.startRecording();
      await this.processAudio(result, index);
    } catch (error) {
      console.log(error);
    }
  }
  base64ToArrayBuffer(base64: string) {
    var binaryString = window.atob(base64);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
  async processAudio(result: RecordingData, index = -1) {
    try {
      this.sendingSounds++;
      if (result.value && result.value.recordDataBase64) {
        const recordData = result.value.recordDataBase64;
        this.audios64.push(recordData);
        //const arrayBuffer = Uint8Array.from(atob(recordData), c => c.charCodeAt(0)).buffer;
        let arrayBuffer = this.base64ToArrayBuffer(recordData);
        // Crear un AudioContext para trabajar con el audio
        const audioContext = new AudioContext();
        // Decodificar el ArrayBuffer a un AudioBuffer
        await audioContext.decodeAudioData(arrayBuffer)
          .then(async (audioBuffer: AudioBuffer) => {
            // Convertir el AudioBuffer a un archivo WAV
            const wav = audioBufferToWav(audioBuffer);
            // Crear un Blob a partir del ArrayBuffer
            const blob = new Blob([wav], { type: 'audio/wav' });
            index < 0 ? this.blobs.push(blob) : this.blobs[index] = blob;
            let formData = new FormData();
            formData.append('uploaded_file', blob, 'audio.wav');
            const response = await this.observationsService.calSoundParameters(formData, this.autocalibration);
            if (await response?.status === "success") {
              if (index < 0) {
                index = this.segments.push(response?.data) - 1;
              } else {
                this.segments[index] = response?.data;
              }
              this.segments[index].start_latitude = this.pathCoords[index].lat
              this.segments[index].start_longitude = this.pathCoords[index].lng
              this.segments[index].end_latitude = this.pathCoords[index + 1].lat
              this.segments[index].end_longitude = this.pathCoords[index + 1].lng
            } else {
              // Hubo un error al guardar el archivo
              console.error('Error al guardar el archivo:', response.statusText);
            }
          })
          .catch((error) => {
            console.error('Error al decodificar el audio:', error);
          });

      }
      this.sendingSounds--;
    } catch (error) {
      this.sendingSounds--;
      console.log(error);
    }
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
    this.resetTimer();
    this.stopTimer();
    await this.clearFilesSystem();
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
        (this.observation.overall &&
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
    this.insomnia.allowSleepAgain();
    await this.navController.navigateForward('/results', navigationExtras);
  }

  async initRecord() {
    console.log("Record");

    if (!this.recording) {
      this.insomnia.keepAwake();
      !this.autocalibration && await this.getAutocalibration();
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
  calculateLAeq(levels: number[] = [41, 66, 45, 53, 45, 50, 61, 58, 57, 63]) {

    const n = levels.length;
    // Convertir los niveles de presión sonora a presión sonora en Pascales
    const pressures = levels.map(level => Math.pow(10, +level / 10));
    // Calcular la presión sonora cuadrada promedio
    const p_squared_avg = pressures.reduce((sum, p) => sum + p, 0) / n;
    // Calcular LAeq en dB
    const LAeq = Math.round(10 * Math.log10(p_squared_avg));

    return LAeq;
  }
  //[17, 15, 15, 15, 14, 14]=14
  // [16, 9, 8, 27, 31, 9, 8, 8, 8] L10=31 L90=8
  calculateL10L90(levels = [16, 9, 8, 27, 31, 9, 8, 8, 8]) {
    // sort LAeqT array (for L10 and L90)
    let sortedMedianArray = levels.slice().sort((a, b) => a - b);
    // calculate L90 and L10
    let L90 = sortedMedianArray[Math.floor(sortedMedianArray.length * 0.1)];
    let L10 = sortedMedianArray[Math.floor(sortedMedianArray.length * 0.9)];

    return { L90, L10 };
  }
}
