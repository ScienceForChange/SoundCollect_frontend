import {Injectable, Sanitizer, SecurityContext} from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
  NavController, Platform
} from '@ionic/angular';
import {StatusBar, Style} from '@capacitor/status-bar';
import {BehaviorSubject, Observable} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

export enum ToastPosition {
  'top' = 'top',
  'bottom' = 'bottom',
  'middle' = 'middle'
}

@Injectable({
  providedIn: 'root'
})

export class CommonService {

  public toggleBackdrop: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor(
    private modalController: ModalController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController,
    private alertCtrl: AlertController,
    private sanitizer: Sanitizer,
    private navController: NavController,
    private translate: TranslateService,
    public platform: Platform
  ) {
  }

  /**
   *
   * @param header Header for toast
   * @param message Content for toast
   * @param color Color of toast options: danger, warning, success, default
   * @param duration Default duration is 2000ms if send a parameter then overwrite this
   * @param position Position available as bottom, top, middle. Use ToastPosition enum for change this
   */
  async presentToast(header: string, message: string, color: string, duration?: number, position?: ToastPosition, goTo?: string) {
    if (!duration) {
      duration = 3000;
    }
    const toast = await this.toastController.create({
      message,
      header,
      color,
      duration,
      position,
      buttons: (goTo) ? [
        {
          side: 'end',
          icon: 'arrow-forward-circle-outline',
          handler: async () => {
            await this.navController.navigateForward(goTo);
          }
        }
      ] : []

    });
    await toast.present();
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async presentActionSheet(header: string, buttons: [{}, {}, {}?, {}?, {}?, {}?], cssClass?: string) {
    buttons.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      }
    });
    const actionSheet = await this.actionSheetController.create({
      header,
      cssClass,
      // @ts-ignore
      buttons,
    });
    await actionSheet.present();
  }

  async showLoader() {
    const message = this.translate.instant('global.label.loading');
    const loading = await this.loadingController.create({
      message
    });
    await loading.present();
  }

  async hideLoader() {
    const loadingCtrl = await this.loadingController.getTop();
    if (!! loadingCtrl) {
      await loadingCtrl.dismiss();
    }
  }

  formatDate(fecha: Date) {
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();
    return (day + '/' + month + '/' + year);
  }

  getTimeFromEpoch(epoch: number) {
    const date = new Date(epoch * 1000);
    return date;
  }

  getEpochDate() {
    return Math.floor(new Date().getTime()/1000.0);
  }

  isSameDay(day: number) {
    const d1 = new Date(day * 1000);
    const d2 = new Date();
    return d1.getFullYear() === d2.getFullYear() &&
          d1.getUTCDate() === d2.getUTCDate() &&
      d1.getMonth() === d2.getMonth();
  }

  alertModal(header: string, message: string) {
    this.alertCtrl.create({
      header,
      message,
      cssClass: 'alertMessages',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel'
      }]
    }).then(alertElement => alertElement.present());
    return;
  }

  sanitizerImg(url: string){
    return this.sanitizer.sanitize(SecurityContext.URL, url);
  }

  /*// eslint-disable-next-line @typescript-eslint/member-ordering
  get deviceOffset() {
    const sat = getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-top');
    const sab = getComputedStyle(document.documentElement).getPropertyValue('--ion-safe-area-bottom');
    return parseFloat(sat.replace('px', '')) + parseFloat(sab.replace('px', ''));
  }*/

  convertH2M(timeInHour: string){
    const timeParts = timeInHour.split(':');
    return Number(timeParts[0]) * 60 + Number(timeParts[1]);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  setItem = async (key: string, value: string) => {
    await Preferences.set({
      key,
      value
    });
  };

  getItem = async (key:string) => {
    const { value } = await Preferences.get({ key });
    return value;
  };

  removeItem= async (key:string) => {
    await Preferences.remove({ key });
  };

  isWeb(){
    return this.platform.is('mobileweb') || this.platform.is('desktop');
  }

  isAppleDevices(){
    return this.platform.is('ios') || this.platform.is('iphone')
      || this.platform.is('ipad' );
  }

  isMobileWidth(){
    return this.platform.width() < 450;
  }

  setStatusBarLigth(){
    if (!this.isWeb()){
      StatusBar.setStyle({style: Style.Light}).then();
    }
  }

  setStatusBarDark(){
    if (!this.isWeb()){
      StatusBar.setStyle({style: Style.Dark}).then();
    }
  }

  getToggleBackdrop(): Observable<boolean> {
    return this.toggleBackdrop.asObservable();
  }

  async presentAlert(text: string) {
    const alert = await this.alertCtrl.create({
      message: 'FCM Token',
      mode: 'md',
      buttons: ['OK'],
      inputs: [
        {
          type:'textarea',
          placeholder: 'Token FCM',
          value: text
        },
      ],
    });

    await alert.present();
  }
   /**
   * Convert and id to API Iri
   * @param entity
   * @param id
   */
   static idToIri(entity: string, id: string) {
    return `/api/${entity}/${id}`;
  }

  /**
   * Convert an Iri to an id
   * @param iri
   */
  static iriToId(iri: string): number {
    const parts = iri.split('/');
    return Number(parts[parts.length - 1]);
  }

}
