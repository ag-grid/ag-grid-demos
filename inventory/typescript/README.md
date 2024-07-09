# AG Grid Inventory Demo (Typescript)

The [AG Grid Inventory Demo](https://ag-grid.com/example-inventory/) in Typescript.

## Getting Started

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git respository files):

   ```
   npx degit ag-grid/ag-grid-demos/inventory/typescript ag-grid-inventory-example-typescript
   cd ag-grid-inventory-example-typescript
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/inventory/typescript
   ```

2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## How It Was Built

This example code was generated with the [Vite Typescript template](https://vitejs.dev/guide/) using:

```
npm create vite@latest inventory/typescript -- --template vanilla-ts

# With the addition of the following modules
npm i @ag-grid-community/styles \
  @ag-grid-community/core \
  @ag-grid-community/client-side-row-model \
  @ag-grid-enterprise/excel-export \
  @ag-grid-enterprise/set-filter \
  @ag-grid-enterprise/multi-filter \
  @ag-grid-enterprise/master-detail
```
