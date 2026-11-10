import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/services/auth-services';

@Component({
  imports: [],
  selector: 'app-top-navigation-bar',
  styleUrl: './top-navigation-bar.css',
  templateUrl: './top-navigation-bar.html',
})
export class TopNavigationBar {
  private auth = inject(AuthService);
    logout(){
    this.auth.logout();
  }
}
