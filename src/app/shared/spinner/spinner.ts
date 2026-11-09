import { Component } from '@angular/core';
import { LoadingService } from '../../core/services/loading-service';
import { inject } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-spinner',
  styleUrl: './spinner.css',
  templateUrl: './spinner.html',
})
export class Spinner {
  loading = inject(LoadingService)
}
