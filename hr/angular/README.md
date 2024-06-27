# AG Grid HR Demo (Angular)

This [AG Grid HR Demo](https://ag-grid.com/example-hr/) in Angular is generated with the [Angular CLI](https://github.com/angular/angular-cli) using:

```
ng new hr/angular

# With the addition of the following modules
npm i @ag-grid-community/angular \
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
   npx degit ag-grid/ag-grid-demos/hr/angular ag-grid-hr-example-angular
   cd ag-grid-hr-example-angular
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/hr/angular
   ```

2. Install dependencies: `npm install`
3. Install the Angular CLI: `npm install -g @angular/cli`
4. Run the dev server: `ng serve`
