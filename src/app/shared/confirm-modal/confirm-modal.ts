import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-confirm-modal',
  styleUrl: './confirm-modal.css',
  templateUrl: './confirm-modal.html',
})
export class ConfirmModal {
  open = input(false);
  title = input('Please confirm');
  message = input('Are you sure?');
  confirmText = input('Confirm');

  confirmed = output<void>();
  cancelled = output<void>();

  cancel(): void {
    if (this.open()) this.cancelled.emit();
  }
}