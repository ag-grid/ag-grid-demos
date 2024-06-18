import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FinanceExample } from './finance-example/finance-example.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FinanceExample],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ag-grid-finance-example-angular';
}
