# AG Grid Inventory Demo (Angular)

The [AG Grid Inventory Demo](https://ag-grid.com/example-inventory/) in Angular.

## Getting Started

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git respository files):

   ```
   npx degit ag-grid/ag-grid-demos/inventory/angular ag-grid-inventory-example-angular
   cd ag-grid-inventory-example-angular
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/inventory/angular
   ```

2. Install dependencies: `npm install`
3. Install the Angular CLI: `npm install -g @angular/cli`
4. Run the dev server: `ng serve`

## How It Was Built

This example code was generated with the [Angular CLI](https://github.com/angular/angular-cli) using:

```
ng new inventory/angular

# With the addition of the following modules
npm i @ag-grid-community/angular \
  @ag-grid-community/styles \
  @ag-grid-community/core \
  @ag-grid-community/client-side-row-model \
  @ag-grid-enterprise/excel-export \
  @ag-grid-enterprise/set-filter \
  @ag-grid-enterprise/multi-filter \
  @ag-grid-enterprise/master-detail
```
