import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  type ColDef,
  createGrid,
  type GetRowIdParams,
  type GridOptions,
  type GridReadyEvent,
  ModuleRegistry,
  themeQuartz,
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

import { getTickerCellRenderer } from "./renderers/getTickerCellRenderer";
import { sparklineTooltipRenderer } from "./renderers/sparklineTooltipRenderer";

import "./style.css";

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

const numberFormatter: ValueFormatterFunc = (params) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  return params.value == null ? "" : formatter.format(params.value);
};

const enableRowGroup = false;
const updateInterval = DEFAULT_UPDATE_INTERVAL;

const createColDefs = (): ColDef[] => {
  return [
    {
      field: "ticker",
      cellRenderer: getTickerCellRenderer(),
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
  ];
};

let rowData = getData();
let gridApi: ReturnType<typeof createGrid> | null = null;
let intervalId: ReturnType<typeof setInterval> | undefined;

const gridOptions: GridOptions = {
  theme: themeQuartz,
  chartThemes: ["ag-default"],
  rowData,
  getRowId: (params: GetRowIdParams) => params.data.ticker,
  onGridReady(params: GridReadyEvent) {
    gridApi = params.api;
  },

  cellSelection: true,
  enableCharts: true,
  rowGroupPanelShow: enableRowGroup ? "always" : "never",
  suppressAggFuncInHeader: true,
  groupDefaultExpanded: -1,

  defaultColDef: {
    flex: 1,
    filter: true,
    enableRowGroup: enableRowGroup,
    enableValue: true,
  },
  columnDefs: createColDefs(),

  statusBar: {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent" },
      { statusPanel: "agTotalRowCountComponent" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  },
};

// Setup the grid after the page has finished loading
document.addEventListener("DOMContentLoaded", function () {
  const gridDiv = document.querySelector("#app") as HTMLElement;
  gridApi = createGrid(gridDiv, gridOptions);

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
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

        gridApi?.applyTransactionAsync({
          update: rowData,
        });
      }, updateInterval);
    } else {
      clearInterval(intervalId);
    }
  });

  observer.observe(gridDiv);
});
