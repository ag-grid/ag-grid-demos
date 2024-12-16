import type {
  ColDef,
  GetDetailRowDataParams,
  GridApi,
  GridOptions,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  createGrid,
  ModuleRegistry,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ExcelExportModule,
  MasterDetailModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";

import "./style.css";
import { getData } from "./data";

import { ActionsCellRenderer } from "./cell-renderers/actionsCellRenderer";
import { PriceCellRenderer } from "./cell-renderers/priceCellRenderer";
import { ProductCellRenderer } from "./cell-renderers/productCellRenderer";
import { StatusCellRenderer } from "./cell-renderers/statusCellRenderer";
import { StockCellRenderer } from "./cell-renderers/stockCellRenderer";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  SetFilterModule,
  MultiFilterModule,
  MasterDetailModule,
]);

let gridApi!: GridApi;

const statuses = {
  all: "All",
  active: "Active",
  paused: "On Hold",
  outOfStock: "Out of Stock",
};
type Status = keyof typeof statuses;

const statusFormatter: ValueFormatterFunc = ({ value }) =>
  statuses[value as keyof typeof statuses] ?? "";

const rowData = getData();
const columnDefs: ColDef[] = [
  {
    field: "product",
    headerName: "Album Name",
    cellRenderer: "agGroupCellRenderer",
    headerClass: "header-product",
    cellRendererParams: {
      innerRenderer: ProductCellRenderer,
    },
    minWidth: 300,
  },
  { field: "artist" },
  { field: "year", width: 150, headerClass: "header-sku" },
  {
    field: "status",
    valueFormatter: statusFormatter,
    cellRenderer: StatusCellRenderer,
    filter: true,
    filterParams: {
      valueFormatter: statusFormatter,
    },
    headerClass: "header-status",
  },

  {
    field: "inventory",
    cellRenderer: StockCellRenderer,
    headerClass: "header-inventory",
    sortable: false,
  },
  {
    field: "incoming",
    cellEditorParams: {
      precision: 0,
      step: 1,
      showStepperButtons: true,
    },
    editable: true,
  },
  {
    field: "price",
    width: 120,
    headerClass: "header-price",
    cellRenderer: PriceCellRenderer,
  },
  { field: "sold", headerClass: "header-calendar" },
  {
    headerName: "Est. Profit",
    colId: "profit",
    headerClass: "header-percentage",
    cellDataType: "number",
    valueGetter: ({ data: { price, sold } }: ValueGetterParams) =>
      (price * sold) / 10,
    valueFormatter: ({ value }: ValueFormatterParams) => `£${value}`,
    width: 150,
  },
  {
    field: "actions",
    cellRenderer: ActionsCellRenderer,
    minWidth: 194,
  },
];
const defaultColDef = {
  resizable: false,
};
const detailCellRendererParams = {
  detailGridOptions: {
    columnDefs: [
      { field: "title", flex: 1.5 },
      { field: "available", maxWidth: 120 },
      { field: "format", flex: 2 },
      { field: "label", flex: 1 },
      { field: "country", flex: 0.66 },
      {
        field: "cat",
        headerName: "Cat#",
        type: "rightAligned",
        flex: 0.66,
      },
      { field: "year", type: "rightAligned", maxWidth: 80 },
    ],
    headerHeight: 38,
  },
  getDetailRowData: ({
    successCallback,
    data: { variantDetails },
  }: GetDetailRowDataParams) => successCallback(variantDetails),
};

const gridOptions: GridOptions = {
  theme: "legacy",
  columnDefs,
  rowData,
  defaultColDef,
  rowHeight: 80,
  paginationPageSizeSelector: [5, 10, 20],
  pagination: true,
  paginationPageSize: 10,
  masterDetail: true,
  detailRowAutoHeight: true,
  autoSizeStrategy: {
    type: "fitGridWidth",
  },
  detailCellRendererParams,
};

function updateActiveTab(status: Status) {
  document.querySelectorAll("#statusTabs button").forEach((button) => {
    if ((button as HTMLElement).dataset.status === status) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
}

function handleTabClick(status: Status) {
  if (!gridApi) {
    return;
  }

  gridApi.setColumnFilterModel(
    "status",
    status === "all" ? null : { values: [status] }
  );
  gridApi.onFilterChanged();

  updateActiveTab(status);
}

// Setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const tabs = document.getElementById("statusTabs");
  Object.entries(statuses).forEach(([key, status]) => {
    const button = document.createElement("button");
    button.className = "tabButton";
    button.textContent = status;
    button.dataset.status = key;
    button.onclick = () => {
      handleTabClick(key as Status);
    };

    tabs?.appendChild(button);
  });
  updateActiveTab("all");

  const gridDiv = document.querySelector("#app") as HTMLElement;
  gridApi = createGrid(gridDiv, gridOptions);

  const filterTextBox = document.getElementById("filter-text-box");
  filterTextBox!.addEventListener("input", (event) => {
    const value = event.target?.value;
    gridApi.setGridOption("quickFilterText", value);
  });
});
