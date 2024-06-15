import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-update-app',
  templateUrl: './update-app.page.html',
  styleUrls: ['./update-app.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule]
})
export class UpdateAppPage implements OnInit {
  extras: NavigationExtras;
  minVersion: string;
  actualVersion: string;
  private router: Router = inject(Router);
  private platform: Platform = inject(Platform);
  constructor() { }

  ngOnInit() {
    this.extras = this.router.getCurrentNavigation()?.extras!;
    if (this.extras) {
      this.minVersion = this.extras.state?.['minVersion'];
      this.actualVersion = this.extras.state?.['actualVersion'];
    }

  }
  updateApp() {
    var urlApp = environment.urlUpdateAndroid;;
    if (this.platform.is('android'))
      urlApp = environment.urlUpdateAndroid;
    if (this.platform.is('ios'))
      urlApp = environment.urlUpdateIOS;

    window.open(urlApp, '_system', 'location=yes,clearcache=no,clearsessioncache=no,closebuttoncaption=X,lefttoright=yes,toolbarposition=top,hidenavigationbuttons=yes,fullscreen=yes,hideurlbar=yes,toolbarcolor=#E96A35,closebuttoncolor=#ffffff'); return false;
  }

}
