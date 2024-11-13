import { MySoundsComponent } from './components/my-sounds/my-sounds.component';
import { Routes } from '@angular/router';
import { autoLoginGuard } from './guards/auto_login-fn.guard';
import { AuthService } from './services';
import { AuthHTTP } from './repos';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.page').then(m => m.OnboardingPage),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.page').then(m => m.LoginPage),
    canActivate: [autoLoginGuard],
    providers: [AuthService, AuthHTTP]
  },
  {
    path: 'password-recovery',
    loadComponent: () => import('./auth/password-recovery/password-recovery.page').then(m => m.PasswordRecoveryPage)
  },
  {
    path: 'password-new',
    loadComponent: () => import('./auth/password-new/password-new.page').then(m => m.PasswordNewPage)
  },
  {
    path: 'password-recovery-code',
    loadComponent: () => import('./auth/password-recovery-code/password-recovery-code.page').then(m => m.PasswordRecoveryCodePage)
  },
  {
    path: 'password-recovery-mail-sended',
    loadComponent: () => import('./auth/password-recovery-mail-sended/password-recovery-mail-sended.page').then(m => m.PasswordRecoveryMailSendedPage)
  },
  {
    path: 'password-recovery-mail-sended',
    loadComponent: () => import('./auth/password-recovery-mail-sended/password-recovery-mail-sended.page').then(m => m.PasswordRecoveryMailSendedPage)
  },
  {
    path: 'edit-profile',
    loadComponent: () => import('./pages/edit-profile/edit-profile.page').then(m => m.EditProfilePage)
  },
  {
    path: 'change-language',
    loadComponent: () => import('./pages/change-language/change-language.page').then(m => m.ChangeLanguagePage)
  },
  {
    path: 'update-app',
    loadComponent: () => import('./pages/update-app/update-app.page').then(m => m.UpdateAppPage)
  },
  {
    path: 'create-profile',
    loadComponent: () => import('./pages/create-profile/create-profile.page').then(m => m.CreateProfilePage)
  },
  {
    path: 'greets',
    loadComponent: () => import('./pages/greets/greets.page').then(m => m.GreetsPage)
  },
  {
    path: 'delete-account',
    loadComponent: () => import('./pages/delete-account/delete-account.page').then(m => m.DeleteAccountPage)
  },
  {
    path: 'collect-sound',
    loadComponent: () => import('./pages/collect-sound/collect-sound.page').then(m => m.CollectSoundPage)
  },
  {
    path: 'results',
    loadComponent: () => import('./pages/results/results.page').then(m => m.ResultsPage)
  },
  {
    path: 'user-guide',
    loadComponent: () => import('./pages/user-guide/user-guide.page').then(m => m.UserGuidePage)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy-policy/privacy-policy.page').then(m => m.PrivacyPolicyPage)
  },
  {
    path: 'terms',
    loadComponent: () => import('./pages/terms/terms.page').then(m => m.TermsPage)
  },
  {
    path: 'data-protection',
    loadComponent: () => import('./pages/data-protection/data-protection.page').then(m => m.DataProtectionPage)
  },
  {
    path: 'sounds',
    loadComponent: () => import('./pages/sounds/sounds.page').then(m => m.SoundsPage)
  },
  {
    path: 'observation-details',
    loadComponent: () => import('./pages/observation-details/observation-details.page').then(m => m.ObservationDetailsPage)
  },
  {
    path: 'calibrate-sound',
    loadComponent: () => import('./pages/calibrate-sound/calibrate-sound.page').then(m => m.CalibrateSoundPage)
  },
  {
    path: 'calibrate-done',
    loadComponent: () => import('./pages/calibrate-done/calibrate-done.page').then(m => m.CalibrateDonePage)
  },
  {
    path: 'achievements',
    loadComponent: () => import('./pages/achievements/achievements.page').then( m => m.AchievementsPage)
  }
];
