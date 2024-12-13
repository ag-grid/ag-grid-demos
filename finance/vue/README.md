# AG Grid Finance Demo (Vue)

The [AG Grid Finance Demo](https://ag-grid.com/example-finance/) in Vue.

## Getting Started

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git respository files):

   ```
   npx degit ag-grid/ag-grid-demos/finance/vue ag-grid-finance-example-vue
   cd ag-grid-finance-example-vue
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/finance/vue
   ```

2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`

## How It Was Built

This example code was generated with the [Vite Vue template](https://vitejs.dev/guide/) using:

```
npm create vite@latest finance/vue -- --template vue-ts

# With the addition of the following modules
npm i ag-charts-enterprise ag-grid-enterprise ag-grid-vue3
```
