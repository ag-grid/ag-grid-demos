# AG Grid Finance Demo (Typescript)

The [AG Grid Finance Demo](https://ag-grid.com/example-finance/) in Typescript.

## Getting Started

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git respository files):

   ```
   npx degit ag-grid/ag-grid-demos/finance/typescript ag-grid-finance-example-typescript
   cd ag-grid-finance-example-typescript
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/finance/typescript
   ```

2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## How It Was Built

This example code was generated with the [Vite Typescript template](https://vitejs.dev/guide/) using:

```
npm create vite@latest finance/typescript -- --template vanilla-ts

# With the addition of the following modules
npm i ag-charts-enterprise ag-grid-enterprise
```
