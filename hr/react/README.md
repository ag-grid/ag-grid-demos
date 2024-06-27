# AG Grid HR Demo (React + TypeScript + Vite)

This [AG Grid HR Demo](https://ag-grid.com/example-hr/) in React.js is generated with the [Vite React Typescript template](https://vitejs.dev/guide/) using:

```
npm create vite@latest hr/react -- --template react-ts

# With the addition of the following modules
npm i @ag-grid-community/react \
  @ag-grid-community/styles \
  @ag-grid-community/core \
  @ag-grid-community/client-side-row-model \
  @ag-grid-enterprise/excel-export \
  @ag-grid-enterprise/master-detail \
  @ag-grid-enterprise/rich-select \
  @ag-grid-enterprise/row-grouping \
  @ag-grid-enterprise/set-filter \
  @ag-grid-enterprise/status-bar
```

## Development

To get started:

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git files):

   ```
   npx degit ag-grid/ag-grid-demos/hr/react ag-grid-hr-example-react-vite
   cd ag-grid-hr-example-react-vite
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/hr/react
   ```

2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
