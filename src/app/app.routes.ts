import { Routes} from '@angular/router';
import {autoLoginGuard} from './guards/auto_login-fn.guard';
import {AuthService} from './services';
import {AuthHTTP} from './repos/auth-repo-http';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then( m => m.OnboardingPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then( m => m.LoginPage),
    canActivate: [autoLoginGuard],
    providers: [AuthService, AuthHTTP]
  },
  {
    path: 'password-recovery',
    loadComponent: () => import('./auth/password-recovery/password-recovery.page').then( m => m.PasswordRecoveryPage)
  },
  {
    path: 'password-new',
    loadComponent: () => import('./auth/password-new/password-new.page').then( m => m.PasswordNewPage)
  },
  {
    path: 'password-recovery-code',
    loadComponent: () => import('./auth/password-recovery-code/password-recovery-code.page').then( m => m.PasswordRecoveryCodePage)
  },
  {
    path: 'password-recovery-mail-sended',
    loadComponent: () => import('./auth/password-recovery-mail-sended/password-recovery-mail-sended.page').then( m => m.PasswordRecoveryMailSendedPage)
  },
  {
    path: 'password-recovery-mail-sended',
    loadComponent: () => import('./auth/password-recovery-mail-sended/password-recovery-mail-sended.page').then( m => m.PasswordRecoveryMailSendedPage)
  },
  {
    path: 'escala-dolor',
    loadComponent: () => import('./pages/escala-dolor/escala-dolor.page').then( m => m.EscalaDolorPage)
  },
  {
    path: 'ejercicio-hoy',
    loadComponent: () => import('./pages/ejercicio-hoy/ejercicio-hoy.page').then( m => m.EjercicioHoyPage)
  },
  {
    path: 'entrenamiento',
    loadComponent: () => import('./pages/entrenamiento/entrenamiento.page').then( m => m.EntrenamientoPage)
  },
  {
    path: 'pose-detection',
    loadComponent: () => import('./pose-detection/pose-detection.page').then( m => m.PoseDetectionPage)
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.page').then( m => m.ChatPage)
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then( m => m.EditProfilePage)
  },  {
    path: 'change-language',
    loadComponent: () => import('./pages/change-language/change-language.page').then( m => m.ChangeLanguagePage)
  },
  {
    path: 'update-app',
    loadComponent: () => import('./pages/update-app/update-app.page').then( m => m.UpdateAppPage)
  },
  {
    path: 'create-profile',
    loadComponent: () => import('./pages/create-profile/create-profile.page').then( m => m.CreateProfilePage)
  },
  {
    path: 'greets',
    loadComponent: () => import('./pages/greets/greets.page').then( m => m.GreetsPage)
  },
  {
    path: 'delete-account',
    loadComponent: () => import('./pages/delete-account/delete-account.page').then( m => m.DeleteAccountPage)
  },
  {
    path: 'collect-sound',
    loadComponent: () => import('./pages/collect-sound/collect-sound.page').then( m => m.CollectSoundPage)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.page').then( m => m.ResultsPage)
  },
  {
    path: 'user-guide',
    loadComponent: () => import('./pages/user-guide/user-guide.page').then( m => m.UserGuidePage)
  }


];
