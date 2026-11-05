import { Component, inject, signal} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  imports: [ ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private formbuilder = inject(FormBuilder);
  private router = inject(Router);

  private validUsername:string = 'admin';
  private validPassword:string = 'Admin@123';

  message = signal('');
  isSuccess = signal(false);
  showPassword = signal(false);

  loginForm = this.formbuilder.group({
    username:  ['', Validators.required],
    password:  ['', [Validators.required, Validators.minLength(8)]]
  })

  get username(){
    return this.loginForm.controls['username'];
  }
  get password(){
    return this.loginForm.controls['password'];
  }

  toggle(){
    this.showPassword.update(n=>!n)
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isSuccess.set(false);
      this.message.set('Please fill in all required fields correctly.');
      return;
    }
    const {username, password} = this.loginForm.getRawValue();

    if(username === this.validUsername && password === this.validPassword) {
      this.isSuccess.set(true);
      this.message.set('Login successful!');
      this.router.navigate(['/participants']);
    } else {
      this.isSuccess.set(false);
      this.message.set('Invalid username or password.');
    }
  }
}
