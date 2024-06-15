import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, CommonService } from './services';
import { environment } from 'src/environments/environment';
import { AuthHTTP } from './repos';
import { SplashScreen } from "@capacitor/splash-screen";
import { TextZoom } from "@capacitor/text-zoom";
import { App } from '@capacitor/app';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule],
  providers: [AuthService, AuthHTTP]
})
export class AppComponent {
  public environmentInjector = inject(EnvironmentInjector);
  private translate = inject(TranslateService);
  private common = inject(CommonService);
  private authService = inject(AuthService);
  navController = inject(NavController);

  defaultLang = "ca";

  constructor() { }
  async ngOnInit() {
    //const locale = await this.common.getItem('locale');
    //console.log("Lang: ", locale);
    //locale && this.translate.use(locale.toLowerCase());
    //if (!locale) this.translate.use("ca");

    await this.initializeApp();
  }
  async initializeApp() {
    // await this.checkVersion();
    const currentLanguage = await this.common.getItem('locale');
    if (currentLanguage) {
      this.translate.use(currentLanguage);
    } else {
      await this.common.setItem('locale', this.defaultLang);
      this.translate.use(this.defaultLang);
    }
    if (!this.common.isWeb()) {
      await SplashScreen.show({
        showDuration: 5000,
        autoHide: true,
      });
      await TextZoom.set({ value: 1 });
    }
    App.addListener('backButton', () => {
      // Prevent default event
    });
  }

  // async checkVersion() {
  //   const actualVersion = environment.API_VERSION;
  //   let minVersion = 1;
  //   try {
  //     const response = await this.authService.verifyVersion();
  //     console.log("Verify Version", response);
  //     if (response.status)
  //       minVersion = response.version;
  //   } catch (e: any) {
  //     console.log(e);
  //   }
  //   if (actualVersion < minVersion) {
  //     console.log("Actualizar la versión");
  //         actualVersion: actualVersion
  //     });
  //   }
  // }
}
