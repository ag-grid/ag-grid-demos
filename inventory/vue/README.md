# AG Grid Inventory Demo (Vue)

This [AG Grid Inventory Demo](https://ag-grid.com/example-inventory/) in Vue is generated with the [Vite Vue template](https://vitejs.dev/guide/) using:

```
npm create vite@latest inventory/vue -- --template vue-ts

# With the addition of the following modules
npm i @ag-grid-community/vue3 \
  @ag-grid-community/styles \
  @ag-grid-community/core \
  @ag-grid-community/client-side-row-model \
  @ag-grid-enterprise/excel-export \
  @ag-grid-enterprise/set-filter \
  @ag-grid-enterprise/multi-filter \
  @ag-grid-enterprise/master-detail

## Development

To get started:

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git files):

   ```
   npx degit ag-grid/ag-grid-demos/inventory/vue ag-grid-inventory-example-vue
   cd ag-grid-inventory-example-vue
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/inventory/vue
   ```

2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
