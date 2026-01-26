import "./styles.css";

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error("App container not found");
}

app.innerHTML = `
  <main class="app-shell">
    <header class="app-header">
      <p class="app-tag">Vite + TypeScript</p>
      <h1>AG Grid Performance Demo</h1>
      <p>Performance demo placeholder for TypeScript. Add the full example when ready.</p>
    </header>
  </main>
`;
