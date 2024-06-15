import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import {introGuard} from '../guards/intro-fn.guard';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../services';
import {AuthHTTP} from '../repos/auth-repo-http';
export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab2',
        loadComponent: () =>
          import('../tab2/tab2.page').then((m) => m.Tab2Page),
      },
      {
        path: 'tab3',
        loadComponent: () =>
          import('../tab3/tab3.page').then((m) => m.Tab3Page),
      },
      {
        path: 'collectSound',
        loadComponent: () =>
          import('../pages/collect-sound/collect-sound.page').then((m) => m.CollectSoundPage),
      },

      {
        path: '',
        redirectTo: '/tabs/tab1',
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
