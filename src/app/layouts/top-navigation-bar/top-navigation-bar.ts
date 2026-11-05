import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-top-navigation-bar',
  styleUrl: './top-navigation-bar.css',
  templateUrl: './top-navigation-bar.html',
})
export class TopNavigationBar {
  private router = inject(Router);
  logout(){
    this.router.navigate(['/Login']);
    console.log('Logout clicked');
  }
}
