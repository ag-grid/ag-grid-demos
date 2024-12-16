import type {
  ColDef,
  GetDataPath,
  ValueFormatterFunc,
  ValueFormatterParams,
  GridOptions,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
  createGrid,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import {
  ExcelExportModule,
  MasterDetailModule,
  RichSelectModule,
  RowGroupingModule,
  SetFilterModule,
  StatusBarModule,
  TreeDataModule,
} from "ag-grid-enterprise";

import "./style.css";
import { ContactCellRenderer } from "./cell-renderers/contactCellRenderer";
import { EmployeeCellRenderer } from "./cell-renderers/employeeCellRenderer";
import { FlagCellRenderer } from "./cell-renderers/flagCellRenderer";
import { StatusCellRenderer } from "./cell-renderers/statusCellRenderer";
import { TagCellRenderer } from "./cell-renderers/tagCellRenderer";
import { getData } from "./data";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  MasterDetailModule,
  RowGroupingModule,
  RichSelectModule,
  SetFilterModule,
  StatusBarModule,
  TreeDataModule,
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
    minWidth: 250,
    flex: 1,
    valueFormatter: departmentFormatter,
    cellRenderer: TagCellRenderer,
  },
  {
    field: "employmentType",
    editable: true,
    width: 180,
    minWidth: 180,
    flex: 1,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: employmentType,
    },
  },
  {
    field: "location",
    width: 200,
    minWidth: 200,
    flex: 1,
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
  theme: "legacy",
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
