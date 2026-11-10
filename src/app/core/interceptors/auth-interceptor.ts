import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth-services';
import { NotificationServices } from '../services/notification-services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const notify = inject(NotificationServices);

  if (req.url.includes('/auth/login') || !req.url.startsWith('/api/')) return next(req);

  if (!auth.isLoggedIn()) {
    if (auth.token()) {
      notify.error('Your session has expired. Please sign in again.');
      auth.logout();
    }

    return throwError(() => new HttpErrorResponse({
      status: 401,
      statusText: 'Session expired',
      url: req.url,
    }));
  }

  return next(req.clone({ setHeaders: { Authorization: `Bearer ${auth.token()}` } }));
};