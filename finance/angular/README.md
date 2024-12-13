# AG Grid Finance Demo (Angular)

The [AG Grid Finance Demo](https://ag-grid.com/example-finance/) code in Angular.

## Getting Started

1. Get a copy of this folder using [degit](https://github.com/Rich-Harris/degit) (without the git respository files):

   ```
   npx degit ag-grid/ag-grid-demos/finance/angular ag-grid-finance-example-angular
   cd ag-grid-finance-example-angular
   ```

   Alternatively, you can get the files using `git clone`:

   ```
   git clone git@github.com:ag-grid/ag-grid-demos.git
   cd ag-grid-demos/finance/angular
   ```

2. Install dependencies: `npm install`
3. Install the Angular CLI: `npm install -g @angular/cli`
4. Run the dev server: `ng serve`

## How It Was Built

This example code was generated with the [Angular CLI](https://github.com/angular/angular-cli) using:

```
ng new finance/angular

# With the addition of the following modules
npm i ag-charts-enterprise ag-grid-enterprise ag-grid-angular
```
