import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, OnInit, Renderer2, ViewChild, ViewRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonicModule, IonRange, NavController } from '@ionic/angular';
import { NavigationExtras, Router, RouterLink, RouterLinkActive } from "@angular/router";
import Swiper from "swiper";
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { AuthService, CommonService, PatientService, ProgramPatientService, ExercisesService, ToastPosition } from "../../services";
import { CronometroComponent } from "../../components/cronometro/cronometro.component";
import { AuthHTTP, PatientHTTP, ActivitytHTTP, ExercisestHTTP, ProgramPatientHTTP } from '../../repos';
import { IActivity, IUserData } from '../../models';
import { environment } from 'src/environments/environment';
import { VideoRecordComponent } from "../../components/video-record/video-record.component";
import { TensorflowService } from 'src/app/services/tensorflow.service';
import { UserRecord } from 'src/app/models/user-record';
import { UserService } from 'src/app/services/user-service';
import { UserHTTP } from 'src/app/repos/user-repo-http';
import { MediaRepoHttp } from 'src/app/repos/media-repo-http';
import { MediaService } from 'src/app/services/media.service';
import { TimerService } from 'src/app/services/timer.service';
import { lastValueFrom, Subscription } from 'rxjs';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';

@Component({
    selector: 'app-entrenamiento',
    templateUrl: './entrenamiento.page.html',
    styleUrls: ['./entrenamiento.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterLinkActive,
        RouterLink,
        CronometroComponent,
        VideoRecordComponent,
        TranslateModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
        HttpClient,
        AuthService,
        AuthHTTP,
        PatientService,
        PatientHTTP,
        ActivitytHTTP,
        ExercisesService,
        ExercisestHTTP,
        ProgramPatientService,
        ProgramPatientHTTP,
        UserService,
        UserHTTP,
        MediaRepoHttp,
        MediaService,
        Insomnia
    ]
})

export class EntrenamientoPage {
    @ViewChild('mySwiperElement') swiperRef!: ElementRef;
    @ViewChild('rangeAudio', { static: false }) range!: IonRange;
    @ViewChild('ionContent') ionContent: IonContent;

    navController = inject(NavController);
    authService = inject(AuthService);
    common = inject(CommonService);
    router = inject(Router);
    private insomnia = inject(Insomnia)
    translate = inject(TranslateService);
    private alertController: AlertController = inject(AlertController);
    timerService = inject(TimerService);
    exercisesService = inject(ExercisesService);
    tensorflowService = inject(TensorflowService);
    userService = inject(UserService);
    mediaService = inject(MediaService);
    programPatientService = inject(ProgramPatientService);

    urlBackend = environment.serverURL;
    mySwiper?: Swiper;
    myStrIndex = -1;
    step = 0;
    actual = 0;
    index = 0;
    progress = 0;
    newValue = 0;
    duration = 0;
    motiveText = '';
    program = '';
    programPatient = '';
    gifId = 0;
    newValueTxt = '00:00';
    durationTxt = '00:00';
    nomImg = 'play';
    play = true;
    stopped: boolean = true;
    isPaused: boolean = false;
    togglePlayBack = true;
    isPlaying = false;
    finalized = false;
    exercises: IActivity[] = [];
    exercise?: IActivity;
    extras: NavigationExtras;
    userData: IUserData;
    options: any;
    dateEntry: number;
    dateExit: number;
    player: any;
    data: any[] = [];
    initialTestRecord: UserRecord;
    evaluationsTest = false;
    finishedExec: any[] = [];
    score: number;
    url = "";
    videoSize = 0;
    programRest = 0;
    sub!: Subscription;
    painScale = 0;
    borgScale = 0;
    finalTestComment = "";
    openQuestion = "";
    todayUserRecord: any = null;

    constructor(private renderer: Renderer2) {
    }

    async ngOnInit() {
        this.extras = this.router.getCurrentNavigation()?.extras!;
        this.userData = await this.extras.state?.['userData'];
        this.exercises = await this.extras.state?.['exercises'];
        console.log('this.exercises', this.exercises);
        this.insomnia.keepAwake()
            .then(
                () => console.log('success'),
                () => console.log('error')
            );

        try {
            await this.common.showLoader();
            if (this.exercises.length > 0) this.programRest = await this.programPatientService.getRestByProgramId({ program_id: this.exercises[0].activityProgramIri });
            //Rango de horas del día de hoy
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            const startOfDayTimestamp = now.getTime() / 1000;
            now.setHours(23, 59, 59, 0);
            const endOfDayTimestamp = now.getTime() / 1000;
            console.log(startOfDayTimestamp + " - " + endOfDayTimestamp + " ----- " + this.exercises[0].activityProgramPatientIri);
            this.todayUserRecord = await this.userService.existUserRecord({ key: "exercise_initial_test", programPatient_id: CommonService.iriToId(this.exercises[0].activityProgramPatientIri), range: startOfDayTimestamp + ".." + endOfDayTimestamp });
            console.log(this.todayUserRecord.userRecords.collection);
            await this.common.hideLoader();
            if (this.todayUserRecord.userRecords.collection.length > 0)
                await this.afterUserRecord();
            this.loadGifs(0);
        } catch (e: any) {
            console.log(e);
            await this.common.hideLoader();
        }




        this.sub = this.timerService.startTimer.subscribe(async (seg) => {
            console.log("Timer entrenamiento: ", seg);
            if (seg === 0 && this.step === 5) {
                console.log("Stop Entrenamiento");
                await this.goNext();
            }
        });
    }

    ionViewWillEnter() {
        this.options = [
            { label: this.translate.instant('training.btn.yes'), value: '0' },
            { label: this.translate.instant('training.btn.no'), value: '1' },
            //{ label: this.translate.instant('training.btn.dont_know'), value: '2' }
        ]
    }

    async goBack() {
        try {
            this.stopWebcam();
            /*const params: NavigationExtras = {
                replaceUrl: true,
                state: {
                    exercises: this.exercises
                }
            };
            await this.navController.navigateBack("ejercicio-hoy", params);*/
            await this.navController.navigateRoot('/tabs', { replaceUrl: true });

        } catch (err: any) {
            await this.common.presentToast(
                this.translate.instant('global_error.label.header'),
                err + "", 'danger');
        }
    }

    setStrIndex(index: number) {
        this.myStrIndex = index;
    }

    swiperReady() {

    }
    async goNext() {
        console.log("Step: --------- ", this.step);
        if (this.myStrIndex >= 0) {
            try {
                await this.common.showLoader();
                this.initialTestRecord = new UserRecord('exercise_initial_test');
                this.initialTestRecord.date = this.common.getEpochDate();
                this.initialTestRecord.owner = `/api/patients/${this.userData.user.id}`;
                this.initialTestRecord.programPatient = this.exercises[0].activityProgramPatientIri;
                this.initialTestRecord.value = JSON.stringify({
                    better: this.options[this.myStrIndex].label,
                    notes: this.motiveText
                });
                await this.userService.createUserRecord(this.initialTestRecord);
                await this.common.hideLoader();
                await this.afterUserRecord();
            } catch (error) {
                console.warn({ error });
            }
        } else if (this.step === 0) {
            console.log("LLenar Cuestionario");
            await this.common.presentToast(
                this.translate.instant('global_error.label.header'),
                this.translate.instant('training.error.initial_questionnaire_empty'), 'danger');
        } else if (this.step === 1) {
            // @ts-ignore
            this.dateEntry = new Date();
            this.step = 2;
            //await this.togglePlayer(false, true);
            this.switchScreen();
            setTimeout(async () => {
                await this.tensorflowService.poseDetection(this.exercises[this.index - 1].activityIri);
            }, 0);


        } else if (this.step === 2) {
            // @ts-ignore
            this.dateExit = new Date();
            await this.stopPlayer();
            await this.togglePlayer(true, true);
            this.stopWebcam();
            /*setTimeout(() => {
                this.url = this.tensorflowService.getUrl();
                this.videoSize = this.tensorflowService.getSize();
                console.log("Url", this.url);
            }, 500);*/
            //this.step = 3;
            await this.nextStepAfterRecord();

        } else if (this.step === 3) {
            await this.nextStepAfterRecord();
        } else if (this.step === 4) {
            if (this.index === this.exercises.length) {
                this.step = 6;
                this.mySwiper?.slideTo(this.exercises.length + 2);
                this.index = this.mySwiper?.activeIndex!;
            } else {
                this.step = 3;
            }
        } else if (this.step === 5) {
            this.mySwiper?.slideTo(this.actual, 100);
            this.index = this.mySwiper?.activeIndex!;
            this.togglePlayer(false, true);
            this.step = 1;
            if (this.gifId < (this.index - 1)) this.loadGifs(this.index - 1, false);
            if (this.timerService.startTimer.value !== 0) this.timerService.stopRestTimer();
            // @ts-ignore
            this.dateEntry = new Date();
        } else if (this.step === 6) {
            if (this.exercises.length > 1) {
                this.exercise = this.exercises[this.index - 1];
            } else {
                this.exercise = this.exercises[0];
            }
            await this.finalizedExercise(true);
            //const mediaSended = await this.tensorflowService.sendRecordedVideos();
            //console.log(mediaSended);


        }
        await this.ionContent.scrollToTop(1000);
    }
    async nextStepAfterRecord() {
        if (this.index !== this.exercises.length) {
            this.mySwiper?.slideTo(this.exercises.length + 1);
            this.exercise = this.exercises[this.index - 1];
            this.actual = this.index + 1;
            this.index = this.mySwiper?.activeIndex!;
            this.step = 5;
            this.timerService.startRestTimer(this.programRest);
            await this.finalizedExercise(false);
        } else {
            this.step = 6;
            this.evaluationsTest = true;
            this.mySwiper?.slideTo(this.exercises.length + 2);
        }
    }

    async finalizedExercise(last: boolean) {
        this.program = this.exercise?.activityProgramIri!;
        this.programPatient = this.exercise?.activityProgramPatientIri!;

        await this.common.showLoader();
        try {
            const mediaResponse = await this.sendMedia(this.tensorflowService.getRecordedVideo(this.exercise!.activityIri));
            console.log("Media: ", mediaResponse);

            console.log(mediaResponse["@id"]);
            if (mediaResponse["@id"]) {
                const payload = {
                    date: this.exercise?.date,
                    finishTime: parseInt(String(Math.abs(this.dateExit - this.dateEntry) / 1000), 10),
                    patient: `/api/patients/${this.userData?.user.id}`,
                    // @ts-ignore
                    programItem: this.exercise.activityIri,
                    //score: 0,
                    //scoreComment: "",
                    video: mediaResponse["@id"] ?? "",
                    videoKeyPoints: this.tensorflowService.getVideoKeypointsStringify()
                };
                this.tensorflowService.clearRecordedVideos();
                this.url = "";
                if (this.programPatient) {
                    // @ts-ignore
                    payload.programPatient = this.programPatient;
                }
                this.finishedExec.push(payload);
                console.log(payload);
                //const { finishedExercise } = await this.exercisesService.createFinish(payload);
                //console.log("FE:", finishedExercise);
                if (last) {
                    this.finishedExec.forEach(async payload => {

                        await this.exercisesService.createFinish(payload);
                        console.log("enviado");

                    });
                    await this.common.presentToast(
                        this.translate.instant('global.label.information'),
                        this.translate.instant('exercises.label.finalized'),
                        'success', undefined, ToastPosition.top
                    );
                    await this.sendFinalQuestionnaire();
                    this.insomnia.allowSleepAgain()
                        .then(
                            () => console.log('success'),
                            () => console.log('error')
                        );
                    await this.navController.navigateRoot('/tabs', { replaceUrl: true });
                }
                await this.common.hideLoader();
            } else {
                await this.common.hideLoader();
                const headerMsg = await lastValueFrom(this.translate.get('global_error.label.header'));
                const message = await lastValueFrom(this.translate.get('global_error.label.upload_media'));
                const close = await lastValueFrom(this.translate.get('home.buttons.btn_close'));
                const ok = await lastValueFrom(this.translate.get('home.buttons.btn_reload'));
                const alert = await this.alertController.create({
                    header: headerMsg,
                    message: message,
                    cssClass: 'my-alert',
                    buttons: [
                        {
                            text: close,
                            role: 'cancel',
                            cssClass: ['my-btn-bg-red', 'my-btn-alert-cancel'],
                            handler: () => {
                                console.log('Alert canceled');
                                this.goBack();
                            },
                        },
                        {
                            text: ok,
                            role: 'confirm',
                            cssClass: 'my-btn-alert-confirm',
                            handler: () => {
                                this.finalizedExercise(last)
                            },
                        },
                    ]
                });
                await alert.present();
            }



        } catch (e) {
            console.log({ e });
            await this.common.hideLoader();
            await this.common.presentToast(
                this.translate.instant('global_error.label.header'),
                this.translate.instant('global_error.label.message'), 'danger', 5000);
        }
    }
    async sendMedia(blob: Blob) {
        try {
            return await this.mediaService.sendMedia(blob);
        } catch (err) {
            /*await this.common.hideLoader();
            await this.common.presentToast(
                this.translate.instant('global_error.label.header'),
                this.translate.instant('global_error.label.upload_media'), 'danger');*/
            return {};
        }
    }
    /*async updatedScore(id: string) {
        const { finishedExercise } = await this.exercisesService.updatedFinish({
            id,
            score: this.score
        });

        console.log('updatedScore', finishedExercise);
        if ('id' in finishedExercise) {
            this.score = 0;
        }
    }*/
    async sendFinalQuestionnaire() {
        let finalTestRecord = new UserRecord('exercise_final_test');
        finalTestRecord.date = this.common.getEpochDate();
        finalTestRecord.owner = `/api/patients/${this.userData.user.id}`;
        finalTestRecord.programPatient = this.exercises[0].activityProgramPatientIri;
        finalTestRecord.value = JSON.stringify({
            painScale: this.painScale,
            borgScale: this.borgScale,
            commentScale: this.finalTestComment,
            openQuestion: this.openQuestion
        });

        await this.userService.createUserRecord(finalTestRecord);
    }
    stopVideo() {
        this.player.stopVideo().then(() => {
            this.stopped = true;
        });
    }

    pauseVideo() {
        this.player.pauseVideo().then(() => {
            console.log('PAUSE VIDEO!!!');
            this.step = 1;
            this.stopped = true;
            this.isPaused = true;
        });
    }

    /*videoPlayerInit(data: any) {
        this.data.push(data);
        // this.data.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.initVdo.bind(this));
        data.getDefaultMedia().subscriptions.loadedData.subscribe((streem: any) => {
            this.duration = streem.target.duration;
            this.durationTxt = this.formatTime(streem.target.duration);
        });
        data.getDefaultMedia().subscriptions.timeUpdate.subscribe((d: any) => {
            // console.log({d});
            const currentTime = data.medias.singleVideo?.time.current;
            const totalTime = data.medias.singleVideo?.time.total;
        });
    }*/

    togglePlayer(pause: boolean, noFullScreen?: boolean) {
        // if (this.duration > 0) {

        this.isPlaying = !pause;
        if (pause) {
            this.nomImg = 'play';
            document.querySelector(`.video-${this.index - 1}`)?.classList.add('zero-height');
            document.querySelector(`.video-${this.index - 1}`)?.classList.remove('video-minimized');
            /*this.data[this.index - 1].getDefaultMedia().pause();*/

        } else {
            this.nomImg = 'pause';
            document.querySelector(`.video-${this.index - 1}`)?.classList.remove('zero-height');
            this.togglePlayBack = false;
            /*this.data[this.index - 1].getDefaultMedia().play();*/
        }
        if (!noFullScreen) {
            this.data[this.index - 1].fsAPI.toggleFullscreen();
        }
    }

    async stopPlayer() {
        this.isPlaying = false;
        this.finalized = true;
        this.nomImg = 'play';
    }

    seek() {
        this.newValue = +this.range.value;
        /*this.data[this.index - 1].getDefaultMedia().seekTime(this.duration * (this.newValue / 100));*/
    }

    // TODO: mejor la function que conviernte de milisegundos al formato correcto de tiempo
    formatTime(second: number) {
        let convert = '00:00';
        let minute = 0;
        let processVal = 0;
        if (typeof second === 'number') {
            processVal = Math.round(second);
            if (processVal > 0) {
                if (processVal < 60) {
                    if (processVal < 10) {
                        convert = '00:0' + processVal;
                    } else {
                        convert = '00:' + processVal;
                    }
                } else {
                    minute = Math.trunc(processVal / 60);
                    second = Math.trunc(processVal % 60);
                    if (minute < 10) {
                        convert = '0' + minute;
                    } else {
                        convert = '' + minute;
                    }
                    convert += ':';
                    if (second < 10) {
                        convert += '0' + second;
                    } else {
                        convert += '' + second;
                    }
                }
            }
        }

        return convert;
    }

    milisecondsToSeconds(miliseconds: number) {
        // @ts-ignore
        const minutes = parseInt((miliseconds / 1000 / 60), 10);
        miliseconds -= minutes * 60 * 1000;
        const seconds = (miliseconds / 1000);
        // @ts-ignore
        return `${this.addZeroisNecesary(minutes)}:${this.addZeroisNecesary(seconds.toFixed(0))}`;
    }

    addZeroisNecesary(value: number) {
        if (value < 10) {
            return '0' + value;
        } else {
            return '' + value;
        }
    }

    fullScreenChange() {
        this.togglePlayer(true, true);
    }

    goPerv(index: number) {
        this.mySwiper?.slideTo(index);
        this.index = this.mySwiper?.activeIndex!;
    }

    togglePlay() {
        this.play = !this.play;
    }

    stopWebcam() {
        this.tensorflowService.stopWebcam();
    }

    async startPD() {
        await this.tensorflowService.poseDetection(this.exercises[this.index - 1].activityIri);
    }

    switchScreen() {

        const videoEl = document.querySelector(`.video-${this.index - 1}`) as HTMLElement;
        const toolbar = document.getElementById("training-toolbar") as HTMLElement;
        const waitPoseDetection = setInterval(() => {
            const el = document.querySelector('.video-canvas') as HTMLElement;
            if (el) {
                clearInterval(waitPoseDetection);
                if (!el.classList.contains('video-minimized')) {
                    el.classList.add('video-minimized');
                    videoEl?.classList.remove('video-minimized');
                    let firstChild = el.parentElement!.firstElementChild;
                    el.parentElement!.insertBefore(videoEl, firstChild);
                    toolbar.appendChild(el);

                } else {
                    el.classList.remove('video-minimized');
                    videoEl?.classList.add('video-minimized');
                    let firstChild = videoEl.parentElement!.firstElementChild;
                    videoEl.parentElement!.insertBefore(el, firstChild);
                    toolbar.appendChild(videoEl);
                }
            }
        }, 100);



    }

    scaleButon(ev: any, scale: string, value: number) {
        scale === "pain" ? this.painScale = value : this.borgScale = value;
        const item = document.querySelector(`.eval-${scale}`);
        item?.querySelectorAll('.btn-eval').forEach(el => {
            el.classList.remove('btn-eval-active');
        });
        ev.target.classList.add('btn-eval-active');
    }
    async afterUserRecord() {
        this.mySwiper = this.swiperRef.nativeElement.swiper;
        this.step = 1;
        this.motiveText = '';
        this.myStrIndex = -1;
        this.mySwiper?.slideNext(1);
        //@ts-ignore
        this.index = this.mySwiper?.activeIndex;
        this.togglePlayer(false, true);
        await this.tensorflowService.preLoadDetector();
    }
    async closeTraining() {
        const headerMsg = await lastValueFrom(this.translate.get('training.label.alert_header'));
        const message = await lastValueFrom(this.translate.get('training.label.alert_message'));
        const cancel = await lastValueFrom(this.translate.get('home.buttons.btn_cancel'));
        const close = await lastValueFrom(this.translate.get('home.buttons.btn_close'));
        const alert = await this.alertController.create({
            header: headerMsg,
            message: message,
            cssClass: 'my-alert',
            buttons: [
                {
                    text: cancel,
                    role: 'cancel',
                    cssClass: ['my-btn-bg-red', 'my-btn-alert-cancel'],
                    handler: () => {
                        console.log('Alert canceled');
                    },
                },
                {
                    text: close,
                    role: 'confirm',
                    cssClass: 'my-btn-alert-confirm',
                    handler: () => {
                        console.log('Alert confirmed');
                        this.goBack();
                    },
                },
            ]
        });
        await alert.present();
    }
    setResult(ev: any) {
        console.log(`Dismissed with role: ${ev.detail.role}`);
    }
    isGif(url: string) {

        if (!url) return false;

        // Obtener extensión del URL
        const extension = url.split('.').pop();

        // Comprobar en minúsculas
        if (extension && extension.toLowerCase() === 'gif') {
            return true;
        }

        return false;

    }
    loadGifs(id: number, secuencial = true) {

        console.log("id: " + id + " - index: " + this.index);

        if (id < this.exercises.length) {
            const imgId = 'img-' + id;
            const img = document.getElementById(imgId) as HTMLImageElement;
            this.gifId = id;
            if (img) {
                if (id !== 0) img.src = this.urlBackend + '/' + this.exercises[id].exerciseVideoUrl;
                console.log(id + " - " + img.src);
                if (secuencial) {
                    if (img.complete) {
                        console.log("Imagen complete" + id);
                        this.loadGifs(this.gifId + 1);
                    } else {
                        img.addEventListener('load', () => {
                            // imagen cargada
                            console.log("Imagen cargada" + id);
                            this.loadGifs(this.gifId + 1);
                        });
                    }
                }
            } else {
                this.loadGifs(id + 1);
            }

        }

    }
}
