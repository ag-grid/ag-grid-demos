import { useIntersectionObserver } from "./utils/useIntersectionObserver";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AllCommunityModule,
  ClientSideRowModelModule,
  type ColDef,
  type GetRowIdFunc,
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
import { AgGridReact } from "ag-grid-react";

import styles from "./FinanceExample.module.css";
import { getData } from "./data";
import { getTickerCellRenderer } from "./renderers/getTickerCellRenderer";

export interface Props {
  gridTheme?: string;
  isDarkMode?: boolean;
  gridHeight?: number | null;
  isSmallerGrid?: boolean;
  updateInterval?: number;
  enableRowGroup?: boolean;
}

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

export const FinanceExample: React.FC<Props> = ({
  gridTheme = "ag-theme-quartz",
  isDarkMode = false,
  gridHeight = null,
  isSmallerGrid,
  updateInterval = DEFAULT_UPDATE_INTERVAL,
  enableRowGroup,
}) => {
  const [rowData, setRowData] = useState(getData());
  const gridRef = useRef<AgGridReact>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);
  const createUpdater = useCallback(() => {
    return setInterval(() => {
      setRowData((rowData) =>
        rowData.map((item) => {
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
        }),
      );
    }, updateInterval);
  }, [updateInterval]);

  useIntersectionObserver({
    elementRef: gridWrapperRef as any,
    onChange: ({ isIntersecting }: { isIntersecting: boolean }) => {
      if (isIntersecting) {
        if (!intervalId.current) {
          intervalId.current = createUpdater();
        }
      } else {
        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      }
    },
  });

  useEffect(() => {
    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, []);

  const colDefs = useMemo<ColDef[]>(() => {
    const allColDefs: ColDef[] = [
      {
        field: "ticker",
        cellRenderer: getTickerCellRenderer(false),
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
  }, [isSmallerGrid]);

  const defaultColDef: ColDef = useMemo(
    () => ({
      flex: 1,
      filter: true,
      enableRowGroup,
      enableValue: true,
    }),
    [enableRowGroup],
  );

  const getRowId = useCallback<GetRowIdFunc>(
    ({ data: { ticker } }: GetRowIdParams) => ticker,
    [],
  );
  const statusBar = useMemo(
    () => ({
      statusPanels: [
        { statusPanel: "agTotalAndFilteredRowCountComponent" },
        { statusPanel: "agTotalRowCountComponent" },
        { statusPanel: "agFilteredRowCountComponent" },
        { statusPanel: "agSelectedRowCountComponent" },
        { statusPanel: "agAggregationComponent" },
      ],
    }),
    [],
  );

  const themeClass = `${gridTheme}${isDarkMode ? "-dark" : ""}`;
  const chartThemes = useMemo(
    () => (isDarkMode ? ["ag-default-dark"] : ["ag-default"]),
    [isDarkMode],
  );

  return (
    <div
      ref={gridWrapperRef}
      style={gridHeight ? { height: gridHeight } : {}}
      className={`${themeClass} ${styles.grid} ${gridHeight ? "" : styles.gridHeight}`}
    >
      <AgGridReact
        chartThemes={chartThemes}
        ref={gridRef}
        getRowId={getRowId}
        rowData={rowData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        cellSelection={true}
        enableCharts
        rowGroupPanelShow={enableRowGroup ? "always" : "never"}
        suppressAggFuncInHeader
        groupDefaultExpanded={-1}
        statusBar={statusBar}
      />
    </div>
  );
};
