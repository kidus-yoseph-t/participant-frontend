import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { NotificationServices } from './notification-services';
import { LoginResponse } from '../models/response.model';



const LOGIN_URL = '/api/v1/auth/login';
const CLIENT_ID = 'acs_apis_client_api';
const TOKEN_KEY = 'auth_token';
const EXPIRES_KEY = 'auth_expires_at';
const DEFAULT_LIFETIME_SECONDS = 120;

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notify = inject(NotificationServices);
  private expiryTimer?: ReturnType<typeof setTimeout>;

  readonly token = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));
  private expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY) ?? 0);

  constructor() {
    if (this.isLoggedIn()) {
      this.scheduleExpiry();
    } else if (this.token()) {
      this.clearSession();
    }
  }

  isLoggedIn(): boolean {
    return !!this.token() && Date.now() < this.expiresAt;
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const body = { username, password, grant_type: 'password', client_id: CLIENT_ID };

    return this.http.post<LoginResponse>(LOGIN_URL, body).pipe(
      tap(res => {
        const token = res.access_token ?? res.accessToken;
        if (!token) throw new Error('The login response did not contain an access token.');

        const lifetime = res.expires_in ?? res.expiresIn ?? DEFAULT_LIFETIME_SECONDS;
        this.expiresAt = Date.now() + lifetime * 1000;

        sessionStorage.setItem(TOKEN_KEY, token);
        sessionStorage.setItem(EXPIRES_KEY, String(this.expiresAt));
        this.token.set(token);
        this.scheduleExpiry();
      })
    );
  }

  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  clearSession(): void {
    clearTimeout(this.expiryTimer);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_KEY);
    this.expiresAt = 0;
    this.token.set(null);
  }

  private scheduleExpiry(): void {
    clearTimeout(this.expiryTimer);
    const remaining = this.expiresAt - Date.now();
    if (remaining <= 0) return;

    this.expiryTimer = setTimeout(() => {
      this.notify.error('Your session has expired. Please sign in again.');
      this.logout();
    }, remaining);
  }
}