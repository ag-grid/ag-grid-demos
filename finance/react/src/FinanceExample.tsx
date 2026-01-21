import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  colorSchemeDark,
  type ColDef,
  type GridSizeChangedEvent,
  type GetRowIdFunc,
  type GetRowIdParams,
  ModuleRegistry,
  themeQuartz,
  type ValueFormatterFunc,
  type ValueGetterParams,
} from "ag-grid-community";
import { AllEnterpriseModule } from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";

import styles from "./FinanceExample.module.css";
import { getData } from "./data";
import { getTickerCellRenderer } from "./renderers/getTickerCellRenderer";
import { sparklineTooltipRenderer } from "./renderers/sparklineTooltipRenderer";

export interface Props {
  isDarkMode?: boolean;
  gridHeight?: number | null;
  isSmallerGrid?: boolean;
  updateInterval?: number;
  enableRowGroup?: boolean;
}

const DEFAULT_UPDATE_INTERVAL = 60;
const PERCENTAGE_CHANGE = 20;
type Breakpoint = "small" | "medium" | "medLarge" | "large" | "xlarge";
type ColWidth = number | "auto";

const BREAKPOINT_CONFIG: Record<
  Breakpoint,
  {
    breakpoint?: number;
    columns: string[];
    tickerColumnWidth: ColWidth;
    timelineColumnWidth: ColWidth;
    hideTickerName?: boolean;
  }
> = {
  small: {
    breakpoint: 500,
    columns: ["ticker", "timeline"],
    tickerColumnWidth: "auto",
    timelineColumnWidth: "auto",
    hideTickerName: true,
  },
  medium: {
    breakpoint: 850,
    columns: ["ticker", "timeline", "totalValue"],
    tickerColumnWidth: 180,
    timelineColumnWidth: 140,
    hideTickerName: true,
  },
  medLarge: {
    breakpoint: 900,
    tickerColumnWidth: 340,
    timelineColumnWidth: 140,
    columns: ["ticker", "timeline", "totalValue", "p&l"],
  },
  large: {
    breakpoint: 1100,
    tickerColumnWidth: 340,
    timelineColumnWidth: 140,
    columns: ["ticker", "timeline", "totalValue", "p&l"],
  },
  xlarge: {
    tickerColumnWidth: 340,
    timelineColumnWidth: 140,
    columns: [
      "ticker",
      "timeline",
      "totalValue",
      "p&l",
      "instrument",
      "price",
      "quantity",
    ],
  },
};

ModuleRegistry.registerModules([
  AllEnterpriseModule.with(AgChartsEnterpriseModule),
]);

const numberFormatter: ValueFormatterFunc = ({ value }) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  return value == null ? "" : formatter.format(value);
};

export const FinanceExample: React.FC<Props> = ({
  isDarkMode = false,
  gridHeight = null,
  isSmallerGrid,
  updateInterval = DEFAULT_UPDATE_INTERVAL,
  enableRowGroup,
}) => {
  const [rowData, setRowData] = useState(getData());
  const gridRef = useRef<AgGridReact>(null);
  const gridWrapperRef = useRef<HTMLDivElement>(null);
  const intervalId = useRef<ReturnType<typeof setInterval>>();
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("xlarge");

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
        })
      );
    }, updateInterval);
  }, [updateInterval]);

  useEffect(() => {
    const element = gridWrapperRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        clearInterval(intervalId.current);
        intervalId.current = createUpdater();
      } else {
        clearInterval(intervalId.current);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      clearInterval(intervalId.current);
    };
  }, [createUpdater]);

  const colDefs = useMemo<ColDef[]>(() => {
    const breakpointConfig = BREAKPOINT_CONFIG[breakpoint];
    const tickerWidthDefs =
      breakpointConfig.tickerColumnWidth === "auto"
        ? { flex: 1 }
        : {
            initialWidth: breakpointConfig.tickerColumnWidth as number,
            minWidth: breakpointConfig.tickerColumnWidth as number,
          };
    const timelineWidthDefs =
      breakpointConfig.timelineColumnWidth === "auto"
        ? { flex: 1 }
        : {
            initialWidth: breakpointConfig.timelineColumnWidth as number,
            minWidth: breakpointConfig.timelineColumnWidth as number,
          };
    const allColDefs: ColDef[] = [
      {
        field: "ticker",
        cellRenderer: getTickerCellRenderer(
          Boolean(breakpointConfig.hideTickerName)
        ),
        ...tickerWidthDefs,
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
        ...timelineWidthDefs,
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
        }
      );
    }

    const cDefs = allColDefs.filter(
      (cDef) =>
        breakpointConfig.columns.includes(cDef.field!) ||
        breakpointConfig.columns.includes(cDef.colId!)
    );

    return cDefs;
  }, [breakpoint, isSmallerGrid]);

  const defaultColDef: ColDef = useMemo(
    () => ({
      flex: 1,
      filter: true,
      enableRowGroup,
      enableValue: true,
    }),
    [enableRowGroup]
  );

  const getRowId = useCallback<GetRowIdFunc>(
    ({ data: { ticker } }: GetRowIdParams) => ticker,
    []
  );

  const onGridSizeChanged = useCallback(
    (params: GridSizeChangedEvent) => {
      if (params.clientWidth < BREAKPOINT_CONFIG.small.breakpoint!) {
        setBreakpoint("small");
      } else if (params.clientWidth < BREAKPOINT_CONFIG.medium.breakpoint!) {
        setBreakpoint("medium");
      } else if (
        params.clientWidth < BREAKPOINT_CONFIG.medLarge.breakpoint!
      ) {
        setBreakpoint("medLarge");
      } else if (params.clientWidth < BREAKPOINT_CONFIG.large.breakpoint!) {
        setBreakpoint("large");
      } else {
        setBreakpoint("xlarge");
      }
    },
    []
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
    []
  );

  const theme = useMemo(() => {
    return isDarkMode ? themeQuartz.withPart(colorSchemeDark) : themeQuartz;
  }, [isDarkMode]);

  const chartThemes = isDarkMode ? ["ag-default-dark"] : ["ag-default"];
  return (
    <div
      ref={gridWrapperRef}
      style={gridHeight ? { height: gridHeight } : {}}
      className={`${styles.grid} ${gridHeight ? "" : styles.gridHeight}`}
    >
      <AgGridReact
        theme={theme}
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
        onGridSizeChanged={onGridSizeChanged}
      />
    </div>
  );
};
