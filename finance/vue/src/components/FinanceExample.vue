<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, withDefaults } from "vue";

import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import {
  colorSchemeDark,
  type ColDef,
  type GetRowIdParams,
  ModuleRegistry,
  themeQuartz,
  type ValueFormatterFunc,
  type ValueGetterParams,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";

import { getData } from "./data";

import TickerCellRenderer from "./renderers/tickerCellRenderer.vue";
import { sparklineTooltipRenderer } from "./renderers/sparklineTooltipRenderer";

const DEFAULT_UPDATE_INTERVAL = 60;
const PERCENTAGE_CHANGE = 20;

const props = withDefaults(
  defineProps<{
    isDarkMode?: boolean;
    isSmallerGrid?: boolean;
    updateInterval?: number;
    enableRowGroup?: boolean;
  }>(),
  {
    updateInterval: DEFAULT_UPDATE_INTERVAL,
  },
);

ModuleRegistry.registerModules([
  AllEnterpriseModule.with(AgChartsEnterpriseModule),
]);

const rowData = ref(getData());
const gridWrapper = ref<HTMLDivElement | null>(null);
const intervalId = ref<ReturnType<typeof setInterval>>();
let observer: IntersectionObserver | undefined;

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

const createUpdater = () => {
  return setInterval(() => {
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
  }, props.updateInterval);
};

const colDefs = computed<ColDef[]>(() => {
  const allColDefs: ColDef[] = [
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

  if (!props.isSmallerGrid) {
    allColDefs.push(
      {
        field: "quantity",
        cellDataType: "number",
        type: "rightAligned",
        valueFormatter: numberFormatter,
        maxWidth: 75,
      },
      {
        headerName: "Price",
        field: "purchasePrice",
        cellDataType: "number",
        type: "rightAligned",
        valueFormatter: numberFormatter,
        maxWidth: 75,
      },
    );
  }

  return allColDefs;
});

const theme = computed(() => {
  return props.isDarkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz;
});
const chartThemes = computed(() =>
  props.isDarkMode ? ["ag-default-dark"] : ["ag-default"],
);
const cellSelection: boolean = true;
const enableCharts: boolean = true;
const rowGroupPanelShow = computed(() =>
  props.enableRowGroup ? "always" : "never",
);
const suppressAggFuncInHeader: boolean = true;
const groupDefaultExpanded = -1;

const defaultColDef = computed<ColDef>(() => ({
  flex: 1,
  filter: true,
  enableRowGroup: props.enableRowGroup,
  enableValue: true,
}));

const statusBar = {
  statusPanels: [
    { statusPanel: "agTotalAndFilteredRowCountComponent" },
    { statusPanel: "agTotalRowCountComponent" },
    { statusPanel: "agFilteredRowCountComponent" },
    { statusPanel: "agSelectedRowCountComponent" },
    { statusPanel: "agAggregationComponent" },
  ],
};

onMounted(() => {
  if (!gridWrapper.value) {
    return;
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      clearInterval(intervalId.value);
      intervalId.value = createUpdater();
    } else {
      clearInterval(intervalId.value);
    }
  });

  observer.observe(gridWrapper.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  clearInterval(intervalId.value);
});
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div ref="gridWrapper" class="grid gridHeight">
        <ag-grid-vue
          :style="{ height: '100%' }"
          :theme="theme"
          :get-row-id="getRowId"
          :row-data="rowData"
          :column-defs="colDefs"
          :default-col-def="defaultColDef"
          :cell-selection="cellSelection"
          :enable-charts="enableCharts"
          :row-group-panel-show="rowGroupPanelShow"
          :suppress-agg-func-in-header="suppressAggFuncInHeader"
          :group-default-expanded="groupDefaultExpanded"
          :status-bar="statusBar"
          :chart-themes="chartThemes"
        />
      </div>
    </div>
  </div>
</template>

<style>
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

.ag-theme-quartz .ag-row-group,
.container {
  width: 100%;
}

.ag-theme-quartz .ag-value-change-value-highlight,
.ag-theme-quartz-dark .ag-value-change-value-highlight {
  padding: 2px 6px;
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
