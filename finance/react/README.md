# AG Grid Finance Demo (React + TypeScript + Vite)

This [AG Grid Finance Demo](https://ag-grid.com/example-finance/) in React.js is generated with the [Vite React Typescript template](https://vitejs.dev/guide/) using:

```
npm create vite@latest finance/react -- --template react-ts

# With the addition of the following modules
npm i @ag-grid-community/react \
  @ag-grid-community/styles \
  @ag-grid-community/core \
  @ag-grid-community/client-side-row-model \
  @ag-grid-enterprise/advanced-filter \
  @ag-grid-enterprise/charts-enterprise \
  @ag-grid-enterprise/column-tool-panel \
  @ag-grid-enterprise/excel-export \
  @ag-grid-enterprise/filter-tool-panel \
  @ag-grid-enterprise/menu \
  @ag-grid-enterprise/range-selection \
  @ag-grid-enterprise/rich-select \
  @ag-grid-enterprise/row-grouping \
  @ag-grid-enterprise/set-filter \
  @ag-grid-enterprise/sparklines \
  @ag-grid-enterprise/status-bar
```

## Development

To get started:

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git files):

   ```
   npx degit ag-grid/ag-grid-demos/finance/react ag-grid-finance-example-react
   cd ag-grid-finance-example-react
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/finance/react
   ```

2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
