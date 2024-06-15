import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule, NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, CommonService } from './services';
import { environment } from 'src/environments/environment';
import { AuthHTTP } from './repos';
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

  constructor() { }
  async ngOnInit() {
    const locale = await this.common.getItem('locale');
    console.log("Lang: ", locale);
    locale && this.translate.use(locale.toLowerCase());
    this.initializeApp();

  }
  async initializeApp() {
    await this.checkVersion();
    if (!this.common.isWeb()) {
      //@ts-ignore
      await window.screen.orientation.lock('portrait');
      /*await SplashScreen.show({
        showDuration: 5000,
        autoHide: true,
      });*/
    }
  }
  async checkVersion() {
    const actualVersion = environment.API_VERSION;
    let minVersion = 1;
    try {
      const response = await this.authService.verifyVersion();
      console.log("Verify Version", response);
      if (response.status)
        minVersion = response.version;

    } catch (e: any) {
      console.log(e);
    }
    if (actualVersion < minVersion) {
      console.log("Actualizar la versión");

      await this.navController.navigateForward("update-app", {
        state: {
          minVersion: minVersion,
          actualVersion: actualVersion
        },
      });
    }
  }
}
