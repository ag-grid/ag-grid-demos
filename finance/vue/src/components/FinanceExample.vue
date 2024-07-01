<script setup lang="ts">
import { ref } from "vue";

import {
  ValueGetterParams,
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

import TickerCellRenderer from "./cell-renderers/tickerCellRenderer.vue";

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
  filter: true,
  enableRowGroup: true,
  enableValue: true,
};
const colDefs: ColDef[] = [
  {
    field: "ticker",
    cellRenderer: TickerCellRenderer,
    minWidth: 380,
  },
  {
    field: "instrument",
    cellDataType: "text",
    type: "rightAligned",
    maxWidth: 180,
  },
  {
    headerName: "P&L",
    cellDataType: "number",
    type: "rightAligned",
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueGetter: ({ data }: ValueGetterParams) =>
      data && data.quantity * (data.price / data.purchasePrice),
    valueFormatter: numberFormatter,
    aggFunc: "sum",
  },
  {
    headerName: "Total Value",
    type: "rightAligned",
    cellDataType: "number",
    valueGetter: ({ data }: ValueGetterParams) =>
      data && data.quantity * data.price,
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueFormatter: numberFormatter,
    aggFunc: "sum",
  },
  {
    field: "quantity",
    cellDataType: "number",
    type: "rightAligned",
    valueFormatter: numberFormatter,
    maxWidth: 150,
  },
  {
    headerName: "Price",
    field: "purchasePrice",
    cellDataType: "number",
    type: "rightAligned",
    valueFormatter: numberFormatter,
    maxWidth: 150,
  },
  {
    field: "purchaseDate",
    cellDataType: "dateString",
    type: "rightAligned",
    hide: true,
  },
  {
    headerName: "Last 24hrs",
    field: "last24",
    cellRenderer: "agSparklineCellRenderer",
    cellRendererParams: {
      sparklineOptions: {
        line: {
          strokeWidth: 2,
        },
      },
    },
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
.grid {
  height: calc(100vh - var(--layout-grid-header-height));
  --ag-value-change-value-highlight-background-color: #44ad4961;
  --ag-value-change-delta-down-color: rgb(255, 0, 92);
  --ag-value-change-delta-up-color: rgb(53, 182, 90);
}

.ag-theme-quartz-dark {
  --ag-row-hover-color: #323a46;
}

.ag-theme-quartz .ag-row-group,
.container {
  width: 100%;
}

.ag-theme-quartz .ag-value-change-value-highlight,
.ag-theme-quartz-dark .ag-value-change-value-highlight {
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 2px;
  padding-bottom: 2px;
  border-radius: 4px;
  margin-left: 4px;
}

.ag-right-aligned-cell {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.custom-name {
  opacity: 0.8;
}
</style>
