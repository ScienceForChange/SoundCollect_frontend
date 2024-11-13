import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {introGuard} from '../guards/intro-fn.guard';
import {AuthService} from '../services';
import {AuthHTTP} from '../repos';
export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../pages/home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'sounds',
        loadComponent: () =>
          import('../pages/sounds/sounds.page').then((m) => m.SoundsPage),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('../pages/profile/profile.page').then((m) => m.ProfilePage),
      },
      {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'onboarding',
    pathMatch: 'full',
  },
  {
    path: 'onboarding',
    canActivate: [introGuard],
    providers: [AuthService, AuthHTTP],
    loadComponent: () =>
      import('../pages/onboarding/onboarding.page').then( m => m.OnboardingPage)
  },
];
