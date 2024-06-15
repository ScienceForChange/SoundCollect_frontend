import { HttpErrorResponse, HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpConfigInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem('jwt_token');
  if (token !== '' && token !== undefined && request.url.indexOf('refresh_token') === -1) {
    request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
  }

  // if (request.url.indexOf('/graphql') > -1 || request.url.indexOf('/custom-operations') > -1) {
  //   request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
  //   request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
  // } else if (request.url.indexOf('/multimedia') < 0) {
  //   request = request.clone({ headers: request.headers.set('Content-Type', 'multipart/form-data') });
  //   request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
  // }

  return next(request).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // TODO Remove when finish develop
        //console.log(event);
      }
      return event;
    }),
    catchError((error) => {
      if (error instanceof HttpErrorResponse && !request.url.includes('authentication_token') && error.status === 401) {
        console.log('REFRESH TOKEN.')
      }
      console.log('err', error);
      return throwError(error);
    })
  );
};
