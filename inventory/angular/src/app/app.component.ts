import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  standalone: true,
  selector: "app-root",
  template: `
    <main class="app-shell">
      <header class="app-header">
        <p class="app-tag">Vite + Angular</p>
        <h1>AG Grid Demo Skeleton</h1>
        <p>
          Clean Angular starter with a minimal layout. Add your app content
          here.
        </p>
      </header>
    </main>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
