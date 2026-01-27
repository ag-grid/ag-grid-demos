import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
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
  ModuleRegistry,
  createGrid,
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
import "ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "./styles.css";

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

ModuleRegistry.registerModules(modules);

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

const staticGridOptions = {
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

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error("App container not found");
}

const exampleWrapper = document.createElement("div");
exampleWrapper.className = "exampleWrapper";
app.append(exampleWrapper);

const toolbar = document.createElement("div");
toolbar.className = "toolbar";
exampleWrapper.append(toolbar);

const controls = document.createElement("div");
controls.className = "controls";
toolbar.append(controls);

const createGroup = (labelText: string, id: string) => {
  const group = document.createElement("div");
  group.className = "group";
  const label = document.createElement("label");
  label.className = "label";
  label.htmlFor = id;
  label.textContent = labelText;
  group.append(label);
  return group;
};

const dataSizeGroup = createGroup("Data Size", "data-size");
const dataSizeSelect = document.createElement("select");
dataSizeSelect.id = "data-size";
dataSizeSelect.className = "select";
dataSizeGroup.append(dataSizeSelect);
controls.append(dataSizeGroup);

const themeGroup = createGroup("Theme", "theme-select");
const themeSelect = document.createElement("select");
themeSelect.id = "theme-select";
themeSelect.className = "select";
themeGroup.append(themeSelect);
controls.append(themeGroup);

const searchGroup = createGroup("Filter", "global-filter");
searchGroup.classList.add("searchGroup");
const searchInput = document.createElement("input");
searchInput.id = "global-filter";
searchInput.className = "input";
searchInput.placeholder = "Filter any column...";
searchInput.type = "text";
searchGroup.append(searchInput);
controls.append(searchGroup);

const gridWrapper = document.createElement("section");
gridWrapper.className = "gridWrapper";
exampleWrapper.append(gridWrapper);

const gridSurface = document.createElement("div");
gridSurface.className = "gridSurface";
gridWrapper.append(gridSurface);

const darkMode = false;
const initialTheme = IS_SSR
  ? "quartz"
  : (new URLSearchParams(window.location.search).get("theme") ?? "quartz");
let gridThemeStr = initialTheme;
let isSmall = IS_SSR
  ? false
  : document.documentElement.clientHeight <= 415 ||
    document.documentElement.clientWidth < 768;

const updateThemeClass = () => {
  gridSurface.className = `gridSurface ${darkMode ? `ag-theme-${gridThemeStr}-dark` : `ag-theme-${gridThemeStr}`}`;
};
updateThemeClass();

const themeOptions = [
  { value: "quartz", label: "Quartz" },
  { value: "balham", label: "Balham" },
  { value: "material", label: "Material" },
  { value: "alpine", label: "Alpine" },
];
themeOptions.forEach((option) => {
  const opt = document.createElement("option");
  opt.value = option.value;
  opt.textContent = option.label;
  themeSelect.append(opt);
});
themeSelect.value = gridThemeStr;

const base64Flags: Record<string, string> = {};
let defaultCols: (ColDef | ColGroupDef)[] = isSmall
  ? smallDefaultCols
  : largeDefaultCols;
let defaultColCount = isSmall ? smallColCount : largeColCount;
let columnDefs: (ColDef | ColGroupDef)[] | undefined;
let rowData: unknown[] | undefined;
let isLoading = true;
let rowCols: [number, number][] = [];
let dataSize: string | undefined;

let loadInstance = 0;
let dataIntervalId: number | null = null;
let dataTimeoutId: number | null = null;

const defaultColDef: ColDef = {
  minWidth: 50,
  editable: true,
  filter: true,
  floatingFilter: !isSmall,
  enableCellChangeFlash: true,
};

const sideBar: SideBarDef = {
  toolPanels: ["columns", "filters-new"],
  position: "right",
  defaultToolPanel: "columns",
  hiddenByDefault: isSmall,
};

const defaultExportParams = (): ExcelExportParams | CsvExportParams => ({
  headerRowHeight: 40,
  rowHeight: 30,
  fontSize: 14,
  addImageToCell: (rowIndex, column, value) => {
    if (column.getColId() === "country" && base64Flags) {
      return {
        image: {
          id: value,
          base64: base64Flags[COUNTRY_CODES[value]],
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
});

const dataSizeOptions = () =>
  rowCols.map(([rows, cols]) => ({
    label: `${rows.toLocaleString()} Rows, ${cols.toLocaleString()} Cols`,
    value: createDataSizeValue(rows, cols),
  }));

const createCols = (colCount: number) => {
  const columns = defaultCols.slice(0, colCount);
  for (let col = defaultColCount; col < colCount; col += 1) {
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
  loadInstance += 1;
  const loadInstanceCopy = loadInstance;
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
    if (loadInstanceCopy !== loadInstance) {
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
          defaultCols.length,
          defaultColCount,
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
        isLoading = false;
        columnDefs = colDefs;
        rowData = data;
        gridApi.setGridOption("columnDefs", columnDefs);
        gridApi.setGridOption("rowData", rowData);
        gridApi.setGridOption("loading", isLoading);
      }, remainingTime);

      if (dataIntervalId) {
        window.clearInterval(dataIntervalId);
        dataIntervalId = null;
      }
    }
  }, 0);
};

const setCountryColumnPopupEditor = (themeName: string, api: GridApi) => {
  if (!api || !columnDefs) {
    return;
  }
  const participantGroup = columnDefs.find(
    (group) => (group as ColGroupDef).headerName === "Participant",
  );
  if (!participantGroup) {
    return;
  }
  const countryColumn: ColDef = (participantGroup as ColGroupDef).children.find(
    (column) => (column as ColDef).field === "country",
  ) as ColDef;
  countryColumn.cellEditorPopup = themeName.includes("material");
  columnDefs = [...columnDefs];
  api.setGridOption("columnDefs", columnDefs);
};

const onGridReady = (event: GridReadyEvent) => {
  if (!IS_SSR && document.documentElement.clientWidth <= 1024) {
    event.api.closeToolPanel();
  }
};

const gridApi = createGrid(gridSurface, {
  ...staticGridOptions,
  theme: themeMap[gridThemeStr] || themeQuartz,
  chartThemes: getDefaultChartThemes(darkMode),
  columnDefs,
  rowData,
  loading: isLoading,
  defaultColDef,
  sideBar,
  columnTypes,
  dataTypeDefinitions,
  rowGroupPanelShow: isSmall ? undefined : "always",
  defaultCsvExportParams: defaultExportParams(),
  defaultExcelExportParams: defaultExportParams(),
  onGridReady,
});

const refreshDataSizeOptions = () => {
  dataSizeSelect.innerHTML = "";
  dataSizeOptions().forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    dataSizeSelect.append(opt);
  });
};

const setupDataOptions = () => {
  rowCols = [
    [100, defaultColCount],
    [1000, defaultColCount],
  ];
  if (!isSmall) {
    rowCols.push(
      [10000, 100],
      [50000, defaultColCount],
      [100000, defaultColCount],
    );
  }
  refreshDataSizeOptions();
  dataSize = createDataSizeValue(rowCols[0][0], rowCols[0][1]);
  dataSizeSelect.value = dataSize;
  scheduleDataLoad(dataSize);
};

const scheduleDataLoad = (size: string) => {
  if (dataTimeoutId) {
    window.clearTimeout(dataTimeoutId);
  }
  isLoading = true;
  gridApi.setGridOption("loading", isLoading);
  dataTimeoutId = window.setTimeout(() => {
    createData(size);
  }, 10);
};

dataSizeSelect.addEventListener("change", () => {
  dataSize = dataSizeSelect.value;
  scheduleDataLoad(dataSize);
});

themeSelect.addEventListener("change", () => {
  const newTheme = themeSelect.value || "quartz";
  setCountryColumnPopupEditor(newTheme, gridApi);
  gridThemeStr = newTheme;
  updateThemeClass();
  gridApi.setGridOption("theme", themeMap[gridThemeStr] || themeQuartz);

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
});

searchInput.addEventListener("input", () => {
  gridApi.setGridOption("quickFilterText", searchInput.value);
});

if (!IS_SSR) {
  const promiseArray = countries.map(async (country) => {
    const countryCode = COUNTRY_CODES[country.country];
    const response = await fetch(`https://flagcdn.com/w20/${countryCode}.png`);
    const blob = await response.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Flags[countryCode] = String(reader.result);
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  });

  Promise.all(promiseArray).then(() => {
    gridApi.setGridOption("defaultCsvExportParams", defaultExportParams());
    gridApi.setGridOption("defaultExcelExportParams", defaultExportParams());
  });
}

setupDataOptions();
