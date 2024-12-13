<script setup lang="ts">
import { ref } from "vue";

import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  type ColDef,
  type GetRowIdParams,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueGetterParams,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  CellSelectionModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  IntegratedChartsModule,
  RichSelectModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SparklinesModule,
  StatusBarModule,
} from "ag-grid-enterprise";

import { getData } from "./data";

import TickerCellRenderer from "./renderers/tickerCellRenderer.vue";
import { sparklineTooltipRenderer } from "./renderers/sparklineTooltipRenderer";

const { gridTheme, isDarkMode } = defineProps({
  gridTheme: {
    type: String,
    default: "ag-theme-quartz",
  },
  isDarkMode: {
    type: Boolean,
  },
});

const DEFAULT_UPDATE_INTERVAL = 60;
const PERCENTAGE_CHANGE = 20;

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  AdvancedFilterModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  RichSelectModule,
  StatusBarModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  SparklinesModule.with(AgChartsEnterpriseModule),
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

function onGridReady() {
  setInterval(() => {
    rowData.value = rowData.value.map((item) => {
      const isRandomChance = Math.random() < 0.1;

      if (!isRandomChance) {
        return item;
      }
      const rnd = (Math.random() * PERCENTAGE_CHANGE) / 100;
      const change = Math.random() > 0.5 ? 1 - rnd : 1 + rnd;
      const price =
        item.price < 10
          ? item.price * change
          : // Increase price if it is too low, so it does not hang around 0
            Math.random() * 40 + 10;

      const timeline = item.timeline
        .slice(1, item.timeline.length)
        .concat(Number(price.toFixed(2)));

      return {
        ...item,
        price,
        timeline,
      };
    });
  }, DEFAULT_UPDATE_INTERVAL);
}

const theme = "legacy";
const cellSelection: boolean = true;
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
  },
  {
    headerName: "Timeline",
    field: "timeline",
    sortable: false,
    filter: false,
    cellRenderer: "agSparklineCellRenderer",
    cellRendererParams: {
      sparklineOptions: {
        type: "bar",
        direction: "vertical",
        axis: {
          strokeWidth: 0,
        },
        tooltip: {
          renderer: sparklineTooltipRenderer,
        },
      },
    },
  },
  {
    field: "instrument",
    cellDataType: "text",
    type: "rightAligned",
    minWidth: 100,
    initialWidth: 100,
  },
  {
    colId: "p&l",
    headerName: "P&L",
    cellDataType: "number",
    filter: "agNumberColumnFilter",
    type: "rightAligned",
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueGetter: ({ data }: ValueGetterParams) =>
      data && data.quantity * (data.price / data.purchasePrice),
    valueFormatter: numberFormatter,
    aggFunc: "sum",
    minWidth: 140,
    initialWidth: 140,
  },
  {
    colId: "totalValue",
    headerName: "Total Value",
    type: "rightAligned",
    cellDataType: "number",
    filter: "agNumberColumnFilter",
    valueGetter: ({ data }: ValueGetterParams) =>
      data && data.quantity * data.price,
    cellRenderer: "agAnimateShowChangeCellRenderer",
    valueFormatter: numberFormatter,
    aggFunc: "sum",
    minWidth: 160,
    initialWidth: 160,
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
      <div class="grid gridHeight" :class="themeClass">
        <ag-grid-vue
          :style="{ height: '100%' }"
          :theme="theme"
          :getRowId="getRowId"
          :onGridReady="onGridReady"
          :rowData="rowData"
          :columnDefs="colDefs"
          :defaultColDef="defaultColDef"
          :cellSelection="cellSelection"
          :enableCharts="enableCharts"
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
@import "ag-grid-community/styles/ag-grid.css";
@import "ag-grid-community/styles/ag-theme-quartz.css";

:root {
  --layout-grid-header-height: 32px;
  --layout-grid-margin: 32px;
}

body {
  margin: 0;
}

.grid {
  --ag-value-change-value-highlight-background-color: #44ad4961;
  --ag-value-change-delta-down-color: rgb(255, 0, 92);
  --ag-value-change-delta-up-color: rgb(53, 182, 90);
}

.gridHeight {
  height: calc(
    100vh - var(--layout-grid-header-height) - var(--layout-grid-margin)
  );
  margin: var(--layout-grid-margin);
}

.ag-theme-quartz-dark .ag-row {
  --ag-row-hover-color: #323a46;
}

@media screen and (max-width: 720px) {
  div.ag-theme-quartz,
  div.ag-theme-quartz-dark {
    --ag-font-size: 12px;
    --ag-grid-size: 6px;
  }
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
  border-radius: 12px;
  margin-left: 4px;
}

.ag-right-aligned-cell {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

.ticker-name {
  opacity: 0.8;
}
</style>
