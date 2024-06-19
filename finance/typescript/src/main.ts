import {
  type ColDef,
  type GetRowIdParams,
  type GridOptions,
  type GridReadyEvent,
  type ValueFormatterFunc,
  createGrid,
} from "@ag-grid-community/core";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { AdvancedFilterModule } from "@ag-grid-enterprise/advanced-filter";
import { GridChartsModule } from "@ag-grid-enterprise/charts-enterprise";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import { FiltersToolPanelModule } from "@ag-grid-enterprise/filter-tool-panel";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { RangeSelectionModule } from "@ag-grid-enterprise/range-selection";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { SparklinesModule } from "@ag-grid-enterprise/sparklines";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { getData } from "./data";

import "./style.css";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  AdvancedFilterModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  GridChartsModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  RichSelectModule,
  StatusBarModule,
  SparklinesModule,
]);

const numberFormatter: ValueFormatterFunc = (params) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  return params.value == null ? "" : formatter.format(params.value);
};

const columnDefs: ColDef[] = [
  {
    field: "ticker",
    cellDataType: "text",
    maxWidth: 140,
  },
  {
    field: "name",
    cellDataType: "text",
    hide: true,
  },
  {
    field: "instrument",
    cellDataType: "text",
    rowGroup: true,
    hide: true,
  },
  {
    headerName: "P&L",
    cellDataType: "number",
    type: "rightAligned",
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueGetter: (params) =>
      params.data &&
      params.data.quantity * (params.data.price / params.data.purchasePrice),
    valueFormatter: numberFormatter,
    aggFunc: "sum",
  },
  {
    headerName: "Total Value",
    type: "rightAligned",
    cellDataType: "number",
    valueGetter: (params) =>
      params.data && params.data.quantity * params.data.price,
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueFormatter: numberFormatter,
    aggFunc: "sum",
  },
  {
    field: "quantity",
    cellDataType: "number",
    maxWidth: 140,
    type: "rightAligned",
    valueFormatter: numberFormatter,
  },
  {
    field: "purchasePrice",
    cellDataType: "number",
    maxWidth: 140,
    type: "rightAligned",
    valueFormatter: numberFormatter,
  },
  {
    field: "purchaseDate",
    cellDataType: "dateString",
    type: "rightAligned",
  },
  {
    headerName: "Last 24hrs",
    field: "last24",
    maxWidth: 500,
    cellRenderer: "agSparklineCellRenderer",
  },
];

let rowData = getData();

const gridOptions: GridOptions = {
  rowData,
  getRowId: (params: GetRowIdParams) => params.data.ticker,
  onGridReady(params: GridReadyEvent) {
    const gridApi = params.api;

    setInterval(() => {
      rowData = rowData.map((item) =>
        Math.random() < 0.1
          ? {
              ...item,
              price:
                item.price +
                item.price *
                  ((Math.random() * 4 + 1) / 100) *
                  (Math.random() > 0.5 ? 1 : -1),
            }
          : item,
      );

      gridApi.applyTransactionAsync({
        update: rowData,
      });
    }, 1000);
  },
  enableRangeSelection: true,
  rowSelection: "multiple",
  enableCharts: true,
  rowGroupPanelShow: "always",
  suppressAggFuncInHeader: true,
  groupDefaultExpanded: -1,

  defaultColDef: {
    flex: 1,
    minWidth: 140,
    maxWidth: 180,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    enableValue: true,
  },
  columnDefs,

  statusBar: {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent" },
      { statusPanel: "agTotalRowCountComponent" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  },
};

// Setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#app") as HTMLElement;
  createGrid(gridDiv, gridOptions);
});
