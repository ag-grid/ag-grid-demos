# AG Grid Inventory Demo (React + TypeScript + Vite)

The [AG Grid Inventory Demo](https://ag-grid.com/example-inventory/) in React.js.

## Getting Started

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git respository files):

   ```
   npx degit ag-grid/ag-grid-demos/inventory/react ag-grid-inventory-example-react
   cd ag-grid-inventory-example-react
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/inventory/react
   ```

2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## How It Was Built

This example code was generated with the [Vite React Typescript template](https://vitejs.dev/guide/) using:

```
npm create vite@latest inventory/react -- --template react-ts

# With the addition of the following modules
npm i @ag-grid-community/react \
  @ag-grid-community/styles \
  @ag-grid-community/core \
  @ag-grid-community/client-side-row-model \
  @ag-grid-enterprise/excel-export \
  @ag-grid-enterprise/set-filter \
  @ag-grid-enterprise/multi-filter \
  @ag-grid-enterprise/master-detail
```
