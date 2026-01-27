<script setup lang="ts">
import {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";
import { AgGridVue } from "ag-grid-vue3";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AllCommunityModule,
  type ColDef,
  type GetRowIdParams,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueGetterParams,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  CellSelectionModule,
  ClipboardModule,
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

const DEFAULT_UPDATE_INTERVAL = 60;
const PERCENTAGE_CHANGE = 20;

ModuleRegistry.registerModules([
  AllCommunityModule,
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
  ClipboardModule,
]);

const numberFormatter: ValueFormatterFunc = ({ value }) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  return value == null ? "" : formatter.format(value);
};

const TickerCellRenderer = defineComponent({
  name: "TickerCellRenderer",
  props: {
    params: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const data = computed(() => (props.params as any).data);
    const hideTickerName = computed(
      () => (props.params as any).hideTickerName ?? false,
    );
    const logoUrl = computed(() =>
      data.value ? `/example/finance/logos/${data.value.ticker}.png` : "",
    );
    const altText = computed(() =>
      data.value ? `${data.value.name} logo` : "",
    );
    return () => {
      if (!data.value) {
        return null;
      }
      return h(
        "div",
        { class: "ticker-cell" },
        [
          h("img", { src: logoUrl.value, alt: altText.value }),
          h("b", { class: "custom-ticker" }, data.value.ticker),
          hideTickerName.value
            ? null
            : h("span", { class: "ticker-name" }, ` ${data.value.name}`),
        ].filter(Boolean),
      );
    };
  },
});

const gridTheme = "ag-theme-quartz";
const isDarkMode = false;
const gridHeight: number | null = null;
const isSmallerGrid = false;
const updateInterval = DEFAULT_UPDATE_INTERVAL;
const enableRowGroup = false;

const rowData = ref(getData());

const colDefs = computed<ColDef[]>(() => {
  const allColDefs: ColDef[] = [
    {
      field: "ticker",
      cellRenderer: "tickerCellRenderer",
      cellRendererParams: {
        hideTickerName: false,
      },
      initialWidth: 340,
      minWidth: 340,
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
        },
      },
      initialWidth: 140,
      minWidth: 140,
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

  if (!isSmallerGrid) {
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

const defaultColDef = computed<ColDef>(() => ({
  flex: 1,
  filter: true,
  enableRowGroup,
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

const chartThemes = computed(() =>
  isDarkMode ? ["ag-default-dark"] : ["ag-default"],
);

const rowGroupPanelShow = computed(() => (enableRowGroup ? "always" : "never"));

const themeClass = computed(() => `${gridTheme}${isDarkMode ? "-dark" : ""}`);

const gridClasses = computed(() => [
  themeClass.value,
  "grid",
  gridHeight ? "" : "gridHeight",
]);

const gridStyle = computed(() =>
  gridHeight
    ? { height: `${gridHeight}px` }
    : {
        height:
          "calc(100vh - var(--layout-grid-header-height) - var(--layout-grid-margin))",
      },
);

const components = {
  tickerCellRenderer: TickerCellRenderer,
};

const getRowId = (params: GetRowIdParams) => params.data.ticker;

const gridWrapper = ref<HTMLDivElement | null>(null);
let intervalId: ReturnType<typeof setInterval> | null = null;
let observer: IntersectionObserver | null = null;

const clearUpdater = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const createUpdater = () =>
  setInterval(() => {
    rowData.value = rowData.value.map((item: any) => {
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
  }, updateInterval);

onMounted(() => {
  if (!gridWrapper.value) {
    return;
  }
  observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry) {
      return;
    }
    if (entry.isIntersecting) {
      if (!intervalId) {
        intervalId = createUpdater();
      }
    } else {
      clearUpdater();
    }
  });
  observer.observe(gridWrapper.value);
});

onBeforeUnmount(() => {
  clearUpdater();
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
</script>

<template>
  <div ref="gridWrapper" :class="gridClasses" :style="gridStyle">
    <AgGridVue
      class="grid-root"
      :rowData="rowData"
      :columnDefs="colDefs"
      :defaultColDef="defaultColDef"
      :getRowId="getRowId"
      :statusBar="statusBar"
      :components="components"
      :chartThemes="chartThemes"
      :cellSelection="true"
      :enableCharts="true"
      :rowGroupPanelShow="rowGroupPanelShow"
      :suppressAggFuncInHeader="true"
      :groupDefaultExpanded="-1"
    />
  </div>
</template>
