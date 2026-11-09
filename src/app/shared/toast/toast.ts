import { Component, effect, inject } from '@angular/core';
import { NotificationServices } from '../../core/services/notification-services';

@Component({
  imports: [],
  selector: 'app-toast',
  styleUrl: './toast.css',
  templateUrl: './toast.html',
})
export class Toast {
  constructor(){
    console.log('toast works');
    effect(() => console.log('toasts', this.notifications.toasts()))
  }
  notifications = inject(NotificationServices);
}
