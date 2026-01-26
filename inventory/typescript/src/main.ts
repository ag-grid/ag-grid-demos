import "./styles.css";

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error("App container not found");
}

app.innerHTML = `
  <main class="app-shell">
    <header class="app-header">
      <p class="app-tag">Vite + TypeScript</p>
      <h1>AG Grid Demo Skeleton</h1>
      <p>Clean TypeScript starter with a minimal layout. Add your app content here.</p>
    </header>
  </main>
`;
