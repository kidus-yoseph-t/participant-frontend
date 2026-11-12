import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth-services';
import { NotificationServices } from '../services/notification-services';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationServices);
  const isApiCall = req.url.startsWith(environment.apiUrl);
  const isLogin = req.url === `${environment.apiUrl}/auth/login`;

  if (!isApiCall || isLogin) return next(req);

  if (!auth.isLoggedIn()) {
    if (auth.token()) {
      notify.error('Your session has expired. Please sign in again.');
      auth.logout();
    }
    return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Session expired', url: req.url }));
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${auth.token()}` } }));
};