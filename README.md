# AG Grid Demos

Vite-based demo apps for the AG Grid examples showcased on https://ag-grid.com/example/.

## Demos and Frameworks

| Demo        | Framework  | Path                                                 |
|-------------|------------|------------------------------------------------------|
| Finance     | Angular    | [`finance/angular`](./finance/angular)               |
| Finance     | React      | [`finance/react`](./finance/react)                   |
| Finance     | TypeScript | [`finance/typescript`](./finance/typescript)         |
| Finance     | Vue        | [`finance/vue`](./finance/vue)                       |
| HR          | Angular    | [`hr/angular`](./hr/angular)                         |
| HR          | React      | [`hr/react`](./hr/react)                             |
| HR          | TypeScript | [`hr/typescript`](./hr/typescript)                   |
| HR          | Vue        | [`hr/vue`](./hr/vue)                                 |
| Performance | Angular    | [`performance/angular`](./performance/angular)       |
| Performance | React      | [`performance/react`](./performance/react)           |
| Performance | TypeScript | [`performance/typescript`](./performance/typescript) |
| Performance | Vue        | [`performance/vue`](./performance/vue)               |
| Inventory   | Angular    | [`inventory/angular`](./inventory/angular)           |
| Inventory   | React      | [`inventory/react`](./inventory/react)               |
| Inventory   | TypeScript | [`inventory/typescript`](./inventory/typescript)     |
| Inventory   | Vue        | [`inventory/vue`](./inventory/vue)                   |

## Workspace setup

- Package manager: `pnpm`
- Root scripts run across all demos via workspaces.

## Common commands

From the repo root:

```bash
pnpm install
pnpm lint
pnpm format
pnpm typecheck
```

To run a specific demo:

```bash
pnpm -C finance/react dev
pnpm -C hr/angular dev
pnpm -C performance/vue dev
pnpm -C inventory/typescript dev
```

## Support

### Enterprise Support

AG Grid Enterprise customers can request help via ZenDesk:
https://ag-grid.zendesk.com/hc/en-us

### Bug Reports

Please file bugs in the main AG Grid repository:
https://github.com/ag-grid/ag-grid/issues

## Developer references

- Performance demo source: https://github.com/ag-grid/ag-grid/tree/latest/documentation/ag-grid-docs/src/components/example-grid
- Finance/HR/Inventory demos source: https://github.com/ag-grid/ag-grid/tree/latest/documentation/ag-grid-docs/src/components/demos
