<script setup lang="ts">
import { ref } from "vue";

import { AgGridVue } from "ag-grid-vue3";
import type {
  ColDef,
  GetDataPath,
  ValueFormatterFunc,
  ValueFormatterParams,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
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

import { getData } from "./data";

import ContactCellRenderer from "./cell-renderers/contactCellRenderer.vue";
import EmployeeCellRenderer from "./cell-renderers/employeeCellRenderer.vue";
import FlagCellRenderer from "./cell-renderers/flagCellRenderer.vue";
import StatusCellRenderer from "./cell-renderers/statusCellRenderer.vue";
import TagCellRenderer from "./cell-renderers/tagCellRenderer.vue";

const { gridTheme, isDarkMode } = defineProps({
  gridTheme: {
    type: String,
    default: "ag-theme-quartz",
  },
  isDarkMode: {
    type: Boolean,
  },
});

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

const rowData = ref(getData());

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
const groupDefaultExpanded = -1;
const treeData = true;

const themeClass = `${gridTheme}${isDarkMode ? "-dark" : ""}`;
const theme = "legacy";
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="grid" :class="themeClass">
        <ag-grid-vue
          :style="{ height: '100%' }"
          :theme="theme"
          :rowData="rowData"
          :columnDefs="columnDefs"
          :groupDefaultExpanded="groupDefaultExpanded"
          :getDataPath="getDataPath"
          :treeData="treeData"
          :autoGroupColumnDef="autoGroupColumnDef"
        >
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<style>
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-quartz.css";
:root {
  --layout-grid-header-height: 32px;
  --layout-grid-margin: 32px;
}

body {
  margin: 0;
}

div.ag-theme-quartz,
div.ag-theme-quartz-dark {
  --ag-row-height: 65px !important;
  --ag-header-height: 48px;
  --ag-header-background-color: transparent;
  --ag-odd-row-background-color: rgb(244, 246, 251);
  --ag-border-color: rgba(140, 140, 140, 0.147);
  --ag-row-border-color: var(--ag-border-color);
}

@media screen and (max-width: 720px) {
  div.ag-theme-quartz,
  div.ag-theme-quartz-dark {
    --ag-font-size: 12px;
    --ag-grid-size: 6px;
  }
}

div.ag-theme-quartz-dark {
  --ag-odd-row-background-color: #252f3f;
}

.ag-theme-quartz .ag-root-wrapper,
.ag-theme-quartz-dark .ag-root-wrapper {
  border: none;
  border-bottom: 1px solid var(--ag-border-color);
  border-radius: 0px;
}

.ag-theme-quartz .ag-body,
.ag-theme-quartz-dark .ag-body,
.ag-theme-quartz .ag-sticky-top,
.ag-theme-quartz-dark .ag-sticky-top,
.ag-theme-quartz .ag-sticky-bottom,
.ag-theme-quartz-dark .ag-sticky-bottom {
  border-right: 1px solid var(--ag-border-color);
  border-left: 1px solid var(--ag-border-color);
}

.ag-theme-quartz .ag-cell,
.ag-theme-quartz-dark .ag-cell {
  display: flex;
  align-items: center !important;
}

.ag-theme-quartz .ag-row-group,
.ag-theme-quartz-dark .ag-row-group {
  height: 100%;
  display: flex;
  align-items: center !important;
}

.ag-theme-quartz .ag-header,
.ag-theme-quartz-dark .ag-header {
  text-transform: uppercase;
  opacity: 0.7;
  font-size: 12px;
}

.ag-theme-quartz .ag-pinned-left-header,
.ag-theme-quartz .ag-pinned-right-header,
.ag-theme-quartz-dark .ag-pinned-left-header,
.ag-theme-quartz-dark .ag-pinned-right-header {
  border-right: none;
  border-left: none;
}

.ag-theme-quartz .ag-header-cell-text,
.ag-theme-quartz-dark .ag-header-cell-text {
  letter-spacing: 1.1px;
  font-weight: 600;
}

.ag-theme-quartz .ag-cell:not(:first-child),
.ag-theme-quartz-dark .ag-cell:not(:first-child) {
  border-left: 1px solid var(--ag-border-color);
}

.ag-theme-quartz .ag-group-expanded,
.ag-theme-quartz-dark .ag-group-expanded {
  opacity: 1;
}

.ag-theme-quartz .ag-icon-tree-closed,
.ag-theme-quartz-dark .ag-icon-tree-closed {
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0px 2px 1px 0px #00000012;
  color: rgb(116, 134, 215);
}

.ag-theme-quartz .ag-icon-tree-open,
.ag-theme-quartz-dark .ag-icon-tree-open {
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0px 2px 1px 0px #00000012;
  color: rgb(116, 134, 215);
}

.grid {
  height: calc(
    100vh - var(--layout-grid-header-height) - var(--layout-grid-margin)
  );
  margin: var(--layout-grid-margin);
}
</style>
