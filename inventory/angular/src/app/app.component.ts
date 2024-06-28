import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { InventoryExample } from './inventory-example/inventory-example.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InventoryExample],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'ag-grid-inventory-example-angular';
}
