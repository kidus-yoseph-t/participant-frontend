import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth-services';
import { NotificationServices } from '../services/notification-services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notify = inject(NotificationServices);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const isLoginRequest = req.url.includes('/auth/login');

      if (!isLoginRequest) {
        if (err.status === 401) auth.logout();
        notify.error(friendlyMessage(err));
      }
      return throwError(() => err);
    })
  );
};


function friendlyMessage(err: HttpErrorResponse): string {
  if (err.status === 0) {
    return 'Cannot reach the server. Check your connection and make sure the backend is running.';
  }
  const serverMessage = typeof err.error?.message === 'string' ? err.error.message : null;

  switch (err.status) {
    case 400: return serverMessage ?? 'The data you sent is invalid. Please check it and try again.';
    case 401: return 'Your session has expired. Please sign in again.';
    case 403: return "You don't have permission to do that.";
    case 404: return serverMessage ?? 'The requested item was not found.';
    case 409: return serverMessage ?? 'This record already exists.';
    case 413: return 'The file is too large.';
    case 415: return 'That file type is not supported. Please use PNG or JPG.';
    case 502:
    case 503:
    case 504: return 'The server is unavailable right now. Please try again shortly.';
    default:
      return err.status >= 500
        ? 'Something went wrong on the server. Please try again.'
        : serverMessage ?? 'Something went wrong. Please try again.';
  }
}