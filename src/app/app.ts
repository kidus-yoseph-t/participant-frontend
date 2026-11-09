import { Component, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Spinner } from './shared/spinner/spinner';
import { Toast } from './shared/toast/toast';

@Component({
  imports: [RouterOutlet, Spinner, Toast],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  protected readonly title = signal('participant-frontend');

}
