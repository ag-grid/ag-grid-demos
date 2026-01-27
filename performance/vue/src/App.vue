<script setup lang="ts">
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import { AgGridVue } from "ag-grid-vue3";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import type {
  ColDef,
  ColGroupDef,
  CsvExportParams,
  ExcelExportParams,
  GridApi,
  GridReadyEvent,
  ILoadingOverlayComp,
  ILoadingOverlayParams,
  SideBarDef,
  Theme,
} from "ag-grid-community";
import {
  AllCommunityModule,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  IntegratedChartsModule,
  MasterDetailModule,
  MultiFilterModule,
  NewFiltersToolPanelModule,
  PivotModule,
  RichSelectModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  RowNumbersModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
} from "ag-grid-enterprise";
import {
  chartThemeOverrides,
  getDefaultChartThemes,
} from "./config/chartOverrides";
import {
  autoGroupColDef,
  columnTypes,
  dataTypeDefinitions,
  largeColCount,
  largeDefaultCols,
  smallColCount,
  smallDefaultCols,
} from "./config/colDefs";
import { excelStyles } from "./config/excelStyles";
import { COUNTRY_CODES, colNames, countries, createRowItem } from "./data";
import { createDataSizeValue } from "./utils";

const IS_SSR = typeof window === "undefined";

const themeMap: Record<string, Theme> = {
  alpine: themeAlpine,
  balham: themeBalham,
  material: themeMaterial,
  quartz: themeQuartz,
};

const modules = [
  AllCommunityModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  NewFiltersToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  CellSelectionModule,
  RichSelectModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
  PivotModule,
  RowNumbersModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
];

class LoadingOverlayComponent implements ILoadingOverlayComp {
  private gui?: HTMLElement;

  init(_params: ILoadingOverlayParams): void {
    const root = document.createElement("div");
    root.className = "ag-overlay-loading-center";
    root.setAttribute("role", "presentation");
    const text = document.createElement("div");
    text.setAttribute("aria-live", "polite");
    text.setAttribute("aria-atomic", "true");
    text.textContent = "Generating rows....";
    root.append(text);
    this.gui = root;
  }

  getGui(): HTMLElement {
    return this.gui ?? document.createElement("div");
  }
}

const gridOptions = {
  statusBar: {
    statusPanels: [
      {
        statusPanel: "agTotalAndFilteredRowCountComponent",
        key: "totalAndFilter",
        align: "left",
      },
      { statusPanel: "agSelectedRowCountComponent", align: "left" },
      { statusPanel: "agAggregationComponent", align: "right" },
    ],
  },
  cellSelection: {
    enableHeaderHighlight: true,
    handle: {
      mode: "fill",
    },
  },
  rowSelection: {
    mode: "multiRow",
  },
  initialGroupOrderComparator: ({
    nodeA,
    nodeB,
  }: {
    nodeA: any;
    nodeB: any;
  }) => {
    const aKey = nodeA.key || "";
    const bKey = nodeB.key || "";
    if (aKey < bKey) {
      return -1;
    }
    if (aKey > bKey) {
      return 1;
    }
    return 0;
  },
  enableRtl: IS_SSR ? false : /[?&]rtl=true/.test(window.location.search),
  pivotPanelShow: "always",
  enableCharts: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 50,
  rowNumbers: true,
  autoGroupColumnDef: autoGroupColDef,
  chartThemeOverrides: chartThemeOverrides,
  excelStyles: excelStyles,
  enableFilterHandlers: true,
  rowDragManaged: true,
  rowDragMultiRow: true,
  loadingOverlayComponent: LoadingOverlayComponent,
};

const darkMode = false;
const gridThemeStr = ref(
  IS_SSR
    ? "quartz"
    : (new URLSearchParams(window.location.search).get("theme") ?? "quartz"),
);
const isSmall = ref(
  IS_SSR
    ? false
    : document.documentElement.clientHeight <= 415 ||
        document.documentElement.clientWidth < 768,
);

const gridTheme = computed(() => themeMap[gridThemeStr.value] || themeQuartz);
const themeClass = computed(() =>
  darkMode
    ? `ag-theme-${gridThemeStr.value}-dark`
    : `ag-theme-${gridThemeStr.value}`,
);
const chartThemes = computed(() => getDefaultChartThemes(darkMode));

const base64Flags = ref<Record<string, string>>();
const defaultCols = ref<(ColDef | ColGroupDef)[]>();
const defaultColCount = ref(0);
const columnDefs = ref<(ColDef | ColGroupDef)[]>();
const rowData = ref<unknown[]>();
const isLoading = ref(true);
const rowCols = ref<[number, number][]>([]);
const dataSize = ref<string>();

const loadInstance = ref(0);
let dataIntervalId: number | null = null;
let dataTimeoutId: number | null = null;

const defaultColDef = computed<ColDef>(() => ({
  minWidth: 50,
  editable: true,
  filter: true,
  floatingFilter: !isSmall.value,
  enableCellChangeFlash: true,
}));

const sideBar = computed<SideBarDef>(() => ({
  toolPanels: ["columns", "filters-new"],
  position: "right",
  defaultToolPanel: "columns",
  hiddenByDefault: isSmall.value,
}));

const defaultExportParams = computed<ExcelExportParams | CsvExportParams>(
  () => ({
    headerRowHeight: 40,
    rowHeight: 30,
    fontSize: 14,
    addImageToCell: (rowIndex, column, value) => {
      if (column.getColId() === "country" && base64Flags.value) {
        return {
          image: {
            id: value,
            base64: base64Flags.value[COUNTRY_CODES[value]],
            imageType: "png",
            width: 20,
            height: 12,
            position: {
              offsetX: 17,
              offsetY: 14,
            },
          },
          value,
        };
      }
      return undefined;
    },
  }),
);

const themeOptions = [
  { value: "quartz", label: "Quartz" },
  { value: "balham", label: "Balham" },
  { value: "material", label: "Material" },
  { value: "alpine", label: "Alpine" },
];

const dataSizeOptions = computed(() =>
  rowCols.value.map(([rows, cols]) => ({
    label: `${rows.toLocaleString()} Rows, ${cols.toLocaleString()} Cols`,
    value: createDataSizeValue(rows, cols),
  })),
);

const createCols = (colCount: number) => {
  const columns = defaultCols.value?.slice(0, colCount) ?? [];
  for (let col = defaultColCount.value; col < colCount; col += 1) {
    const colName = colNames[col % colNames.length];
    columns.push({
      headerName: colName,
      field: `col${col}`,
      width: 200,
      editable: true,
      filter: "agTextColumnFilter",
    });
  }
  return columns;
};

const createData = (newDataSize: string) => {
  loadInstance.value += 1;
  const loadInstanceCopy = loadInstance.value;
  const startTime = Date.now();

  const colCount = parseInt(newDataSize?.split("x")[1] ?? "0", 10);
  const rowCount = parseFloat(newDataSize?.split("x")[0] ?? "0");
  const colDefs = createCols(colCount);

  let row = 0;
  const data: unknown[] = [];
  const loopCount = rowCount > 10000 ? 10000 : 1000;

  if (dataIntervalId) {
    window.clearInterval(dataIntervalId);
  }
  dataIntervalId = window.setInterval(() => {
    if (loadInstanceCopy !== loadInstance.value) {
      if (dataIntervalId) {
        window.clearInterval(dataIntervalId);
        dataIntervalId = null;
      }
      return;
    }

    for (let i = 0; i < loopCount; i += 1) {
      if (row < rowCount) {
        const rowItem = createRowItem(
          row,
          colCount,
          defaultCols.value?.length ?? 0,
          defaultColCount.value,
        );
        data.push(rowItem);
        row += 1;
      } else {
        break;
      }
    }

    if (row >= rowCount) {
      const elapsedTime = Date.now() - startTime;
      const minDisplayTime = 500;
      const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

      window.setTimeout(() => {
        isLoading.value = false;
        columnDefs.value = colDefs;
        rowData.value = data;
      }, remainingTime);

      if (dataIntervalId) {
        window.clearInterval(dataIntervalId);
        dataIntervalId = null;
      }
    }
  }, 0);
};

const gridApi = ref<GridApi | null>(null);

const setCountryColumnPopupEditor = (themeName: string, api: GridApi) => {
  if (!api || !columnDefs.value) {
    return;
  }
  const participantGroup = columnDefs.value.find(
    (group) => (group as ColGroupDef).headerName === "Participant",
  );
  if (!participantGroup) {
    return;
  }
  const countryColumn: ColDef = (participantGroup as ColGroupDef).children.find(
    (column) => (column as ColDef).field === "country",
  ) as ColDef;
  countryColumn.cellEditorPopup = themeName.includes("material");
  columnDefs.value = [...columnDefs.value];
};

const onGridReady = (event: GridReadyEvent) => {
  gridApi.value = event.api;
  if (!IS_SSR && document.documentElement.clientWidth <= 1024) {
    event.api.closeToolPanel();
  }
};

const handleDataSizeChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  dataSize.value = target.value;
};

const handleThemeChange = (event: Event) => {
  if (!gridApi.value) {
    return;
  }
  const target = event.target as HTMLSelectElement;
  const newTheme = target.value || "quartz";
  setCountryColumnPopupEditor(newTheme, gridApi.value);
  gridThemeStr.value = newTheme;

  if (!IS_SSR) {
    let url = window.location.href;
    if (url.includes("?theme=")) {
      url = url.replace(/\?theme=[\w:-]+/, `?theme=${newTheme}`);
    } else {
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}theme=${newTheme}`;
    }
    history.replaceState({}, "", url);
  }
};

const onFilterChanged = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!gridApi.value) {
    return;
  }
  gridApi.value.setGridOption("quickFilterText", target.value);
};

watch(dataSize, (value) => {
  if (!value) {
    return;
  }
  isLoading.value = true;
  if (dataTimeoutId) {
    window.clearTimeout(dataTimeoutId);
  }
  dataTimeoutId = window.setTimeout(() => {
    createData(value);
  }, 10);
});

onMounted(() => {
  defaultCols.value = isSmall.value ? smallDefaultCols : largeDefaultCols;
  defaultColCount.value = isSmall.value ? smallColCount : largeColCount;

  const newRowsCols: [number, number][] = [
    [100, defaultColCount.value],
    [1000, defaultColCount.value],
  ];
  if (!isSmall.value) {
    newRowsCols.push(
      [10000, 100],
      [50000, defaultColCount.value],
      [100000, defaultColCount.value],
    );
  }
  rowCols.value = newRowsCols;
  dataSize.value = createDataSizeValue(newRowsCols[0][0], newRowsCols[0][1]);

  if (!IS_SSR) {
    const flags: Record<string, string> = {};
    const promiseArray = countries.map(async (country) => {
      const countryCode = COUNTRY_CODES[country.country];
      const response = await fetch(
        `https://flagcdn.com/w20/${countryCode}.png`,
      );
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          flags[countryCode] = String(reader.result);
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    });

    Promise.all(promiseArray).then(() => {
      base64Flags.value = flags;
    });
  }
});

onBeforeUnmount(() => {
  if (dataIntervalId) {
    window.clearInterval(dataIntervalId);
    dataIntervalId = null;
  }
  if (dataTimeoutId) {
    window.clearTimeout(dataTimeoutId);
    dataTimeoutId = null;
  }
});
</script>

<template>
  <div class="exampleWrapper">
    <div class="toolbar">
      <div class="controls">
        <div class="group">
          <label class="label" for="data-size">Data Size</label>
          <select
            id="data-size"
            class="select"
            :value="dataSize"
            @change="handleDataSizeChange"
          >
            <option
              v-for="option in dataSizeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="group">
          <label class="label" for="theme-select">Theme</label>
          <select
            id="theme-select"
            class="select"
            :value="gridThemeStr"
            @change="handleThemeChange"
          >
            <option
              v-for="option in themeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="group searchGroup">
          <label class="label" for="global-filter">Filter</label>
          <input
            id="global-filter"
            class="input"
            placeholder="Filter any column..."
            type="text"
            @input="onFilterChanged"
          />
        </div>
      </div>
    </div>
    <section class="gridWrapper">
      <div class="gridSurface" :class="themeClass">
        <AgGridVue
          class="grid-root"
          :modules="modules"
          :gridOptions="gridOptions"
          :theme="gridTheme"
          :chartThemes="chartThemes"
          :columnDefs="columnDefs"
          :rowData="rowData"
          :loading="isLoading"
          :defaultColDef="defaultColDef"
          :sideBar="sideBar"
          :columnTypes="columnTypes"
          :dataTypeDefinitions="dataTypeDefinitions"
          :rowGroupPanelShow="isSmall ? undefined : 'always'"
          :defaultCsvExportParams="defaultExportParams"
          :defaultExcelExportParams="defaultExportParams"
          @grid-ready="onGridReady"
        />
      </div>
    </section>
  </div>
</template>
