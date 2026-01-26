import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  type ColDef,
  createGrid,
  type GetRowIdParams,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueGetterParams,
  type ICellRendererParams,
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
import "ag-grid-community/styles/ag-theme-quartz.css";
import "./styles.css";
import { getData } from "./data";

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
  ClipboardModule,
]);

const numberFormatter: ValueFormatterFunc = ({ value }) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  return value == null ? "" : formatter.format(value);
};

const tickerCellRenderer = (
  params: ICellRendererParams & { hideTickerName?: boolean },
) => {
  const data = params.data as { ticker: string; name: string } | undefined;
  if (!data) {
    return "";
  }

  const container = document.createElement("div");
  container.className = "ticker-cell";

  const image = document.createElement("img");
  image.src = `/example/finance/logos/${data.ticker}.png`;
  image.alt = `${data.name} logo`;

  const ticker = document.createElement("b");
  ticker.className = "custom-ticker";
  ticker.textContent = data.ticker;

  container.append(image, ticker);

  if (!params.hideTickerName) {
    const name = document.createElement("span");
    name.className = "ticker-name";
    name.textContent = ` ${data.name}`;
    container.append(name);
  }

  return container;
};

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error("App container not found");
}

const gridTheme = "ag-theme-quartz";
const isDarkMode = false;
const gridHeight: number | null = null;
const isSmallerGrid = false;
const updateInterval = DEFAULT_UPDATE_INTERVAL;
const enableRowGroup = false;

const gridWrapper = document.createElement("div");
const themeClass = `${gridTheme}${isDarkMode ? "-dark" : ""}`;
gridWrapper.className = `${themeClass} grid ${gridHeight ? "" : "gridHeight"}`.trim();
if (gridHeight) {
  gridWrapper.style.height = `${gridHeight}px`;
}
app.append(gridWrapper);

let rowData = getData();

const colDefs: ColDef[] = [
  {
    field: "ticker",
    cellRenderer: tickerCellRenderer,
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
  colDefs.push(
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

const gridApi = createGrid(gridWrapper, {
  rowData,
  columnDefs: colDefs,
  defaultColDef: {
    flex: 1,
    filter: true,
    enableRowGroup,
    enableValue: true,
  },
  getRowId: (params: GetRowIdParams) => params.data.ticker,
  statusBar: {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent" },
      { statusPanel: "agTotalRowCountComponent" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  },
  cellSelection: true,
  enableCharts: true,
  rowGroupPanelShow: enableRowGroup ? "always" : "never",
  suppressAggFuncInHeader: true,
  groupDefaultExpanded: -1,
  chartThemes: isDarkMode ? ["ag-default-dark"] : ["ag-default"],
});

let intervalId: ReturnType<typeof setInterval> | null = null;
let observer: IntersectionObserver | null = null;

const clearUpdater = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};

const updateRows = () => {
  rowData = rowData.map((item) => {
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

  gridApi.setGridOption("rowData", rowData);
};

const createUpdater = () => setInterval(updateRows, updateInterval);

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

observer.observe(gridWrapper);

window.addEventListener("beforeunload", () => {
  clearUpdater();
  if (observer) {
    observer.disconnect();
    observer = null;
  }
});
