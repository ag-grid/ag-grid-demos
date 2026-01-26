import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-root",
  template: `
    <main class="app-shell">
      <header class="app-header">
        <p class="app-tag">Vite + Angular</p>
        <h1>AG Grid Performance Demo</h1>
        <p>
          Performance demo placeholder for Angular. Add the full example when
          ready.
        </p>
      </header>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
