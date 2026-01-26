import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  type ColDef,
  type GetDataPath,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueFormatterParams,
} from "ag-grid-community";
import {
  ExcelExportModule,
  MasterDetailModule,
  RichSelectModule,
  RowGroupingModule,
  SetFilterModule,
  StatusBarModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { ContactCellRendererComponent } from "./cell-renderers/contact-cell-renderer.component";
import { EmployeeCellRendererComponent } from "./cell-renderers/employee-cell-renderer.component";
import { FlagCellRendererComponent } from "./cell-renderers/flag-cell-renderer.component";
import { StatusCellRendererComponent } from "./cell-renderers/status-cell-renderer.component";
import { TagCellRendererComponent } from "./cell-renderers/tag-cell-renderer.component";
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

@Component({
  standalone: true,
  selector: "app-root",
  imports: [
    CommonModule,
    AgGridAngular,
    ContactCellRendererComponent,
    EmployeeCellRendererComponent,
    FlagCellRendererComponent,
    StatusCellRendererComponent,
    TagCellRendererComponent,
  ],
  template: `
    <div class="wrapper">
      <div class="container">
        <div class="grid" [ngClass]="themeClass">
          <ag-grid-angular
            class="grid-root"
            [columnDefs]="colDefs"
            [rowData]="rowData"
            [rowHeight]="62"
            [groupDefaultExpanded]="-1"
            [getDataPath]="getDataPath"
            [treeData]="true"
            [autoGroupColumnDef]="autoGroupColumnDef"
            [components]="components"
          >
          </ag-grid-angular>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  gridTheme = "ag-theme-quartz";
  isDarkMode = false;
  themeClass = this.isDarkMode ? `${this.gridTheme}-dark` : this.gridTheme;

  rowData = getData();

  colDefs: ColDef[] = [
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
      cellRenderer: "tagCellRenderer",
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
      cellRenderer: "flagCellRenderer",
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
      cellRenderer: "statusCellRenderer",
      cellEditor: "agRichSelectCellEditor",
      cellEditorParams: {
        values: paymentStatus,
      },
    },
    {
      field: "contact",
      pinned: "right",
      cellRenderer: "contactCellRenderer",
      width: 120,
    },
  ];

  getDataPath: GetDataPath = (data) => data.orgHierarchy;

  autoGroupColumnDef: ColDef = {
    headerName: "Employee",
    width: 330,
    pinned: "left",
    sort: "asc",
    cellRenderer: "agGroupCellRenderer",
    cellRendererParams: {
      suppressCount: true,
      innerRenderer: "employeeCellRenderer",
    },
  };

  components = {
    contactCellRenderer: ContactCellRendererComponent,
    employeeCellRenderer: EmployeeCellRendererComponent,
    flagCellRenderer: FlagCellRendererComponent,
    statusCellRenderer: StatusCellRendererComponent,
    tagCellRenderer: TagCellRendererComponent,
  };
}
