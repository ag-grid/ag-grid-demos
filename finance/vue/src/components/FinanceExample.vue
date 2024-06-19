<script setup lang="ts">
import { ref } from "vue";

import {
  type ColDef,
  type GetRowIdParams,
  type GridReadyEvent,
  type ValueFormatterFunc,
} from "@ag-grid-community/core";
import { AgGridVue } from "@ag-grid-community/vue3";
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

import { getData } from "./data";

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

const rowData = ref(getData());

const numberFormatter: ValueFormatterFunc = (params) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  return params.value == null ? "" : formatter.format(params.value);
};

function getRowId(params: GetRowIdParams) {
  return params.data.ticker;
}

function onGridReady(params: GridReadyEvent) {
  setInterval(() => {
    rowData.value = rowData.value.map((item) =>
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
  }, 1000);
}

const enableRangeSelection: boolean = true;
const rowSelection: "multiple" | "single" | undefined = "multiple";
const enableCharts: boolean = true;
const rowGroupPanelShow: "always" | "onlyWhenGrouping" | "never" | undefined =
  "always";
const suppressAggFuncInHeader: boolean = true;
const groupDefaultExpanded = -1;

const defaultColDef: ColDef = {
  flex: 1,
  minWidth: 140,
  maxWidth: 180,
  filter: true,
  floatingFilter: true,
  enableRowGroup: true,
  enableValue: true,
};
const colDefs: ColDef[] = [
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

const statusBar = {
  statusPanels: [
    { statusPanel: "agTotalAndFilteredRowCountComponent" },
    { statusPanel: "agTotalRowCountComponent" },
    { statusPanel: "agFilteredRowCountComponent" },
    { statusPanel: "agSelectedRowCountComponent" },
    { statusPanel: "agAggregationComponent" },
  ],
};

const themeClass = `${gridTheme}${isDarkMode ? "-dark" : ""}`;
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="grid" :class="themeClass">
        <ag-grid-vue
          :style="{ height: '100%' }"
          :getRowId="getRowId"
          :onGridReady="onGridReady"
          :rowData="rowData"
          :columnDefs="colDefs"
          :defaultColDef="defaultColDef"
          :enableRangeSelection="enableRangeSelection"
          :enableCharts="enableCharts"
          :rowSelection="rowSelection"
          :rowGroupPanelShow="rowGroupPanelShow"
          :suppressAggFuncInHeader="suppressAggFuncInHeader"
          :groupDefaultExpanded="groupDefaultExpanded"
          :statusBar="statusBar"
        >
        </ag-grid-vue>
      </div>
    </div>
  </div>
</template>

<style>
@import "@ag-grid-community/styles/ag-grid.css";
@import "@ag-grid-community/styles/ag-theme-quartz.css";

:root {
  --layout-grid-header-height: 32px;
}

.icon {
  margin-right: 8px;
}

.grid {
  --ag-row-height: 36px;
  --ag-header-height: 40px;
  --ag-header-background-color: #fff;
  height: calc(100vh - var(--layout-grid-header-height));
}

.ag-theme-quartz-dark {
  --ag-background-color: #001223;
  --ag-foreground-color: #d8e0e8;

  --ag-borders: 1px solid;
  --ag-border-color: rgba(255, 255, 255, 0.144);

  --ag-odd-row-background-color: #001223;

  --ag-header-background-color: #001223;
  --ag-header-foreground-color: #8fa0b2;

  --input-background-color: #001223;
  --input-focus-box-shadow-color: rgba(255, 255, 255, 0.25);
}

.ag-theme-quartz .ag-row-group,
.container {
  width: 100%;
}

.sidebar {
  background: hsl(0, 0%, 100%);
  height: 100%;
  width: 56px;
  border-right: 1px solid rgb(207, 207, 207);
  display: flex;
  justify-content: center;
  padding-top: 16px;
  opacity: 0.4;
}

.wrapper {
  display: flex;
  background: var(--color-bg-primary);
  overflow: hidden;
}

.buttonIcon {
  width: 16px;
  height: 16px;
  opacity: 0.7;
  margin-right: 8px;
}

.sidebarIcon {
  height: 20px;
  width: 20px;
  opacity: 0.5;
  transition: all 0.5s;
}

.sidebarIcon:hover {
  opacity: 1;
  cursor: pointer;
  transition: all 0.5s;
}

.settingsIcon {
  height: 20px;
  width: 20px;
  opacity: 0.5;
  transition: all 0.5s;
  margin-bottom: 16px;
}

.settingsIcon:hover {
  opacity: 1;
  cursor: pointer;
  transition: all 0.5s;
}

.activeIcon {
  height: 20px;
  width: 20px;
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.075);
  border-radius: 4px;
}

.ag-right-aligned-cell {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.ag-theme-quartz .cell-green {
  color: rgb(39, 134, 66);
}

.ag-theme-quartz .cell-red {
  color: rgb(208, 10, 46);
}

.ag-theme-quartz-dark .cell-green {
  color: rgb(62, 201, 102);
}

.grid .cell-green::before {
  content: "↑";
  margin-right: 8px;
}

.ag-theme-quartz-dark .cell-red {
  color: rgb(255, 0, 92);
  background-color: rgb(255, 0, 92, 0.1);
  border-radius: 100px;
}

.grid .cell-red::before {
  content: "↓";
  margin-right: 8px;
}
</style>
