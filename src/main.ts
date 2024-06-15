import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import {
    HttpClientModule,
    provideHttpClient,
    withInterceptors,
    HttpBackend,
    HttpClient,
    HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import {JwtModule} from '@auth0/angular-jwt';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import {httpConfigInterceptor} from './app/Interceptors/http-config.interceptor';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ApolloModule} from 'apollo-angular';
import {GraphQLModule} from './app/graphql.module';
import localeEs from '@angular/common/locales/es';
import localeCaEs from '@angular/common/locales/ca-ES-valencia';
import {registerLocaleData} from '@angular/common';

registerLocaleData(localeEs, 'es');
registerLocaleData(localeCaEs, 'ca');

if (environment.production) {
  enableProdMode();
}
const tokenGet = async () => {
  const { value } = await Preferences.get({ key: 'jwt_token' });
  return value;
};
export function newTranslateLoader(handler: HttpBackend) {
    const http = new HttpClient(handler);
    return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(
        IonicModule.forRoot({}),
        ApolloModule,
        GraphQLModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: tokenGet,
          },
        }),
        TranslateModule.forRoot({
            defaultLanguage: 'es',
            loader: {
                provide: TranslateLoader,
                useFactory: newTranslateLoader,
                deps: [HttpBackend]
            }
        })
    ),
    importProvidersFrom(HttpClientModule),
    provideHttpClient(withInterceptors([httpConfigInterceptor])),
    provideRouter(routes),
  ],
});
