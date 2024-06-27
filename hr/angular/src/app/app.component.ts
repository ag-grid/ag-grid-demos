import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HRExample } from './hr-example/hr-example.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HRExample],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ag-grid-hr-example-angular';
}
