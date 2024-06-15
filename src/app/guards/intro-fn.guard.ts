import {CanActivateFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService, CommonService} from '../services';
import {NavController} from '@ionic/angular';
export const introGuard: CanActivateFn =  async () => {

  const commonService = inject(CommonService);
  const navController = inject(NavController);
  const authService = inject(AuthService);

  const hasSeenIntro = await commonService.getItem(authService.INTRO_KEY);
  console.log('hasSeenIntro hasSeenIntro', (hasSeenIntro && (hasSeenIntro === 'TRUE')));
  console.log('hasSeenIntro hasSeenIntro', commonService.isWeb());
  if ((hasSeenIntro && (hasSeenIntro === 'TRUE'))) {
    await navController.navigateRoot('/login', {replaceUrl: true});
    return false;
  } else {
    return true;
  }
}