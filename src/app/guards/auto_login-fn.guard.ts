import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService, CommonService } from '../services';
import { NavController } from '@ionic/angular';
export const autoLoginGuard: CanActivateFn = async () => {
  const commonService = inject(CommonService);
  const navController = inject(NavController);
  const authService = inject(AuthService);
  const token = await commonService.getItem(authService.jwtTokenName);
  if (token) {
    await navController.navigateRoot('/tabs', { replaceUrl: true });
    return true;
  } else {
    return true;
  }
}
