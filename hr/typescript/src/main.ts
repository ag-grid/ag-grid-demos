import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import {
  type ColDef,
  type GetDataPath,
  type GridOptions,
  type ValueFormatterFunc,
  type ValueFormatterParams,
  createGrid,
} from "@ag-grid-community/core";
import { ModuleRegistry } from "@ag-grid-community/core";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import { ExcelExportModule } from "@ag-grid-enterprise/excel-export";
import { MasterDetailModule } from "@ag-grid-enterprise/master-detail";
import { RichSelectModule } from "@ag-grid-enterprise/rich-select";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { SetFilterModule } from "@ag-grid-enterprise/set-filter";
import { StatusBarModule } from "@ag-grid-enterprise/status-bar";

import "./style.css";
import { ContactCellRenderer } from "./cell-renderers/contactCellRenderer";
import { EmployeeCellRenderer } from "./cell-renderers/employeeCellRenderer";
import { FlagCellRenderer } from "./cell-renderers/flagCellRenderer";
import { StatusCellRenderer } from "./cell-renderers/statusCellRenderer";
import { TagCellRenderer } from "./cell-renderers/tagCellRenderer";
import { getData } from "./data";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  ExcelExportModule,
  MasterDetailModule,
  RowGroupingModule,
  RichSelectModule,
  SetFilterModule,
  StatusBarModule,
]);

const employmentType = ["Permanent", "Contract"];
const paymentMethod = ["Cash", "Check", "Bank Transfer"];
const paymentStatus = ["Paid", "Pending"];
const departments = {
  executiveManagement: "Executive Management",
  legal: "Legal",
  design: "Design",
  engineering: "Engineering",
  product: "Product",
  customerSupport: "Customer Support",
};
const departmentFormatter: ValueFormatterFunc = ({ value }) =>
  departments[value as keyof typeof departments] ?? "";

const columnDefs: ColDef[] = [
  {
    headerName: "ID",
    field: "employeeId",
    width: 120,
  },
  {
    field: "department",
    width: 250,
    valueFormatter: departmentFormatter,
    cellRenderer: TagCellRenderer,
  },
  {
    field: "employmentType",
    editable: true,
    width: 180,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: employmentType,
    },
  },
  {
    field: "location",
    width: 200,
    cellRenderer: FlagCellRenderer,
    editable: true,
  },
  {
    field: "joinDate",
    editable: true,
    width: 120,
  },
  {
    headerName: "Salary",
    field: "basicMonthlySalary",
    valueFormatter: ({ value }: ValueFormatterParams) =>
      value == null ? "" : `$${Math.round(value).toLocaleString()}`,
  },
  {
    field: "paymentMethod",
    editable: true,
    width: 180,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: paymentMethod,
    },
  },
  {
    headerName: "Status",
    field: "paymentStatus",
    editable: true,
    width: 100,
    cellRenderer: StatusCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: paymentStatus,
    },
  },
  {
    field: "contact",
    pinned: "right",
    cellRenderer: ContactCellRenderer,
    width: 120,
  },
];

let rowData = getData();
const getDataPath: GetDataPath = (data) => data.orgHierarchy;
const autoGroupColumnDef: ColDef = {
  headerName: "Employee",
  width: 330,
  pinned: "left",
  sort: "asc",
  cellRenderer: "agGroupCellRenderer",
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: EmployeeCellRenderer,
  },
};

const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowData,
  groupDefaultExpanded: -1,
  getDataPath,
  treeData: true,
  autoGroupColumnDef,
};

// Setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#app") as HTMLElement;
  createGrid(gridDiv, gridOptions);
});
