import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth-services';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  showPassword = signal(false);
  message = signal('');
  isSuccess = signal(false);

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }

  toggle(): void {
    this.showPassword.update(v => !v);
  }

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isSuccess.set(false);
      this.message.set('Username and password are required.');
      return;
    }

    const { username, password } = this.loginForm.getRawValue();
    this.message.set('');

    this.auth.login(username, password).subscribe({
      next: () => this.router.navigate(['/participants']),
      error: () => {
        this.isSuccess.set(false);
        this.message.set('Invalid username or password.');
      },
    });
  }
}