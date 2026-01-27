import { CSSProperties } from "react";
import styles from "./EcommerceExample.module.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState, useCallback } from "react";
import { getData } from "./data";
import { DaysOfStockRenderer } from "./cell-renderers/DaysOfStockRenderer";
import { MomentumRenderer } from "./cell-renderers/MomentumRenderer";
import { ProductHealthRenderer } from "./cell-renderers/ProductHealthRenderer";
import { RatingRenderer } from "./cell-renderers/RatingRenderer";
import { StatusBadgeRenderer } from "./cell-renderers/StatusBadgeRenderer";
import { PriceChangeRenderer } from "./cell-renderers/PriceChangeRenderer";
import { MarginBarRenderer } from "./cell-renderers/MarginBarRenderer";
import { KpiDashboard } from "./components/KpiDashboard";
import {
  themeQuartz,
  ColDef,
  ColGroupDef,
  AutoSizeStrategy,
  ModuleRegistry,
  TextFilterModule,
  NumberFilterModule,
  GetDetailRowDataParams,
  CellSelectionOptions,
} from "ag-grid-community";
import {
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  PivotModule,
  SetFilterModule,
  FiltersToolPanelModule,
  CellSelectionModule,
  SparklinesModule,
  MasterDetailModule,
  StatusBarModule,
} from "ag-grid-enterprise";
import {
  AgChartsCommunityModule,
  AgSparklineOptions,
} from "ag-charts-community";

ModuleRegistry.registerModules([
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  PivotModule,
  TextFilterModule,
  CellSelectionModule,
  NumberFilterModule,
  SetFilterModule,
  FiltersToolPanelModule,
  SparklinesModule.with(AgChartsCommunityModule),
  MasterDetailModule,
  StatusBarModule,
]);

export default function EcommerceExample() {
  const gridStyle: CSSProperties = {
    height: "100vh",
    width: "100%",
  };

  const cellSelection = useMemo<boolean | CellSelectionOptions>(() => {
    return { handle: { mode: "range" } };
  }, []);

  const theme = useMemo(() => themeQuartz, []);

  const gridRef = useRef<AgGridReact>(null);
  const [rowData] = useState(getData());
  const [isPivotMode, setIsPivotMode] = useState(false);
  const [pivotDimension, setPivotDimension] = useState<"month" | "warehouse">(
    "month"
  );
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("US-West");
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-01");

  const warehouses = ["US-West", "EU-Central", "Asia-East"];
  const months = [
    { value: "2025-02", label: "Feb '25" },
    { value: "2025-03", label: "Mar '25" },
    { value: "2025-04", label: "Apr '25" },
    { value: "2025-05", label: "May '25" },
    { value: "2025-06", label: "Jun '25" },
    { value: "2025-07", label: "Jul '25" },
    { value: "2025-08", label: "Aug '25" },
    { value: "2025-09", label: "Sep '25" },
    { value: "2025-10", label: "Oct '25" },
    { value: "2025-11", label: "Nov '25" },
    { value: "2025-12", label: "Dec '25" },
    { value: "2026-01", label: "Jan '26" },
  ];

  // Flatten data by month for pivot mode
  const flattenByMonth = useCallback((data: ReturnType<typeof getData>) => {
    return data.flatMap((product) =>
      product.monthlySales.map((sale) => ({
        ...product,
        month: sale.month,
        monthLabel: new Date(sale.month + "-01").toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        }),
        unitsSold: sale.sold,
        revenue: sale.sold * product.price,
      }))
    );
  }, []);

  // Flatten data by warehouse for pivot mode
  const flattenByWarehouse = useCallback((data: ReturnType<typeof getData>) => {
    const warehouses = new Set<string>();
    data.forEach((product) => {
      Object.keys(product.stockByWarehouse).forEach((wh) => warehouses.add(wh));
    });

    return data.flatMap((product) =>
      Array.from(warehouses).map((warehouse) => ({
        ...product,
        warehouse,
        stock:
          (product.stockByWarehouse as Record<string, number>)[warehouse] ?? 0,
        incoming:
          (product.incomingByWarehouse as Record<string, number>)[warehouse] ??
          0,
        // Allocate revenue proportionally by stock
        unitsSold: Math.round(
          (product.monthlySales.reduce((sum, m) => sum + m.sold, 0) *
            ((product.stockByWarehouse as Record<string, number>)[warehouse] ??
              0)) /
            Math.max(
              1,
              Object.values(
                product.stockByWarehouse as Record<string, number>
              ).reduce((a, b) => a + b, 0)
            )
        ),
        revenue: Math.round(
          (product.monthlySales.reduce(
            (sum, m) => sum + m.sold * product.price,
            0
          ) *
            ((product.stockByWarehouse as Record<string, number>)[warehouse] ??
              0)) /
            Math.max(
              1,
              Object.values(
                product.stockByWarehouse as Record<string, number>
              ).reduce((a, b) => a + b, 0)
            )
        ),
      }))
    );
  }, []);

  const autoSizeStrategy = useMemo<AutoSizeStrategy>(() => {
    return {
      type: "fitCellContents",
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      // flex: 1,
      filter: true,
      sortable: true,
      // enableValue: true,
    }),
    []
  );

  const handleGroupByCategory = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const updatedColDefs = colDefs.map((col) => {
      if ("children" in col) {
        return {
          ...col,
          children: col.children.map((child) => {
            if (
              "field" in child &&
              (child.field === "category" || child.field === "subcategory")
            ) {
              return { ...child, rowGroup: true, hide: true };
            }
            if ("field" in child && child.field === "sku") {
              return { ...child, hide: true };
            }
            return child;
          }),
        };
      }
      return col;
    });

    api.setGridOption("columnDefs", updatedColDefs);
  };

  const handleReset = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    setIsPivotMode(false);
    api.setGridOption("pivotMode", false);
    api.setRowGroupColumns([]);
    api.setColumnsVisible(["sku"], true);
    api.setGridOption("columnDefs", colDefs);
    api.setGridOption("rowData", rowData);
    // Clear all filters
    api.setFilterModel(null);
  };

  // Pivot column definitions for month-based pivot
  const pivotColDefsMonth = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: "Category",
        field: "category",
        rowGroup: true,
        hide: true,
        enableRowGroup: true,
      },
      {
        headerName: "Subcategory",
        field: "subcategory",
        rowGroup: true,
        hide: true,
        enableRowGroup: true,
      },
      {
        headerName: "Product",
        field: "product",
        rowGroup: true,
        hide: true,
        enableRowGroup: true,
      },
      {
        headerName: "Month",
        field: "monthLabel",
        pivot: true,
        enablePivot: true,
      },
      {
        headerName: "Revenue",
        field: "revenue",
        aggFunc: "sum",
        enableValue: true,
      },
      {
        headerName: "Units Sold",
        field: "unitsSold",
        aggFunc: "sum",
        enableValue: true,
      },
    ];
  }, []);

  // Pivot column definitions for warehouse-based pivot
  const pivotColDefsWarehouse = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: "Category",
        field: "category",
        rowGroup: true,
        hide: true,
        enableRowGroup: true,
      },
      {
        headerName: "Subcategory",
        field: "subcategory",
        rowGroup: true,
        hide: true,
        enableRowGroup: true,
      },
      {
        headerName: "Product",
        field: "product",
        rowGroup: true,
        hide: true,
        enableRowGroup: true,
      },
      {
        headerName: "Warehouse",
        field: "warehouse",
        pivot: true,
        enablePivot: true,
      },
      {
        headerName: "Revenue",
        field: "revenue",
        aggFunc: "sum",
        enableValue: true,
      },
      {
        headerName: "Units Sold",
        field: "unitsSold",
        aggFunc: "sum",
        enableValue: true,
      },
      {
        headerName: "Stock",
        field: "stock",
        aggFunc: "sum",
        enableValue: true,
      },
    ];
  }, []);

  const handlePivotMode = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    setIsPivotMode(true);

    if (pivotDimension === "month") {
      const pivotData = flattenByMonth(rowData);
      api.setGridOption("rowData", pivotData);
      api.setGridOption("columnDefs", pivotColDefsMonth);
    } else {
      const pivotData = flattenByWarehouse(rowData);
      api.setGridOption("rowData", pivotData);
      api.setGridOption("columnDefs", pivotColDefsWarehouse);
    }

    api.setGridOption("pivotMode", true);
  };

  const handleFilterLowStock = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    // Map warehouse names to column field names
    const warehouseFieldMap: Record<string, string> = {
      "US-West": "stockByWarehouse.US-West",
      "EU-Central": "stockByWarehouse.EU-Central",
      "Asia-East": "stockByWarehouse.Asia-East",
    };

    const fieldName = warehouseFieldMap[selectedWarehouse];
    if (!fieldName) return;

    // Clear all warehouse filters first
    Object.values(warehouseFieldMap).forEach((field) => {
      api.setColumnFilterModel(field, null);
    });

    // Apply filter for selected warehouse: stock < 10
    api.setColumnFilterModel(fieldName, {
      filterType: "number",
      type: "lessThan",
      filter: 10,
    });

    api.onFilterChanged();
  };

  const handleFilterLowSales = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    // Clear all month filters first
    months.forEach((m) => {
      api.setColumnFilterModel(`sales-${m.value}`, null);
    });

    // Apply filter for selected month: sold < 5
    api.setColumnFilterModel(`sales-${selectedMonth}`, {
      filterType: "number",
      type: "lessThan",
      filter: 5,
    });

    api.onFilterChanged();
  };

  const colDefs = useMemo<(ColDef | ColGroupDef)[]>(() => {
    return [
      // ===== IDENTITY (Pinned) =====
      {
        headerName: "Product",
        field: "product",
        pinned: "left",
        minWidth: 220,
        cellRenderer: "agGroupCellRenderer",
        filter: "agTextColumnFilter",
      },
      {
        headerName: "SKU",
        field: "sku",
        pinned: "left",
        minWidth: 140,
        filter: "agTextColumnFilter",
      },

      // ===== STATUS & HEALTH =====
      {
        headerName: "Status & Health",
        children: [
          {
            headerName: "Health",
            colId: "healthScore",
            minWidth: 80,
            cellRenderer: ProductHealthRenderer,
            valueGetter: ({ data }) => {
              if (!data) return null;

              // Calculate margin score (0-25)
              const marginPct = ((data.price - data.cost) / data.price) * 100;
              const marginScore = Math.min(25, (marginPct / 60) * 25);

              // Calculate velocity score (0-25)
              const velocity =
                data.monthlySales.reduce(
                  (s: number, m: { sold: number }) => s + m.sold,
                  0
                ) / 12;
              const velocityScore = Math.min(25, (velocity / 20) * 25);

              // Calculate rating score (0-25)
              const ratingScore = Math.min(
                25,
                ((data.avgRating - 3) / 2) * 25
              );

              // Calculate stock score (0-25)
              let stockScore = 25;
              if (!data.isDigital) {
                const totalStock = Object.values(
                  data.stockByWarehouse as Record<string, number>
                ).reduce((a, b) => a + b, 0);
                const daysOfStock =
                  velocity > 0 ? (totalStock / velocity) * 30 : 999;
                stockScore =
                  daysOfStock >= 30 ? 25 : (daysOfStock / 30) * 25;
              }

              const totalScore =
                marginScore + velocityScore + ratingScore + stockScore;

              let grade: string;
              if (totalScore >= 80) grade = "A";
              else if (totalScore >= 60) grade = "B";
              else if (totalScore >= 40) grade = "C";
              else if (totalScore >= 20) grade = "D";
              else grade = "F";

              return {
                score: totalScore,
                grade,
                breakdown: {
                  margin: marginScore,
                  velocity: velocityScore,
                  rating: ratingScore,
                  stock: stockScore,
                },
              };
            },
            comparator: (valueA, valueB) => {
              return (valueA?.score ?? 0) - (valueB?.score ?? 0);
            },
            filter: "agSetColumnFilter",
            filterValueGetter: ({ data }) => {
              if (!data) return null;
              const marginPct = ((data.price - data.cost) / data.price) * 100;
              const marginScore = Math.min(25, (marginPct / 60) * 25);
              const velocity =
                data.monthlySales.reduce(
                  (s: number, m: { sold: number }) => s + m.sold,
                  0
                ) / 12;
              const velocityScore = Math.min(25, (velocity / 20) * 25);
              const ratingScore = Math.min(
                25,
                ((data.avgRating - 3) / 2) * 25
              );
              let stockScore = 25;
              if (!data.isDigital) {
                const totalStock = Object.values(
                  data.stockByWarehouse as Record<string, number>
                ).reduce((a, b) => a + b, 0);
                const daysOfStock =
                  velocity > 0 ? (totalStock / velocity) * 30 : 999;
                stockScore =
                  daysOfStock >= 30 ? 25 : (daysOfStock / 30) * 25;
              }
              const totalScore =
                marginScore + velocityScore + ratingScore + stockScore;
              if (totalScore >= 80) return "A";
              if (totalScore >= 60) return "B";
              if (totalScore >= 40) return "C";
              if (totalScore >= 20) return "D";
              return "F";
            },
          },
          {
            headerName: "Status",
            field: "status",
            cellRenderer: StatusBadgeRenderer,
            filter: "agSetColumnFilter",
            minWidth: 120,
          },
          {
            headerName: "Momentum",
            colId: "momentum",
            minWidth: 120,
            cellRenderer: MomentumRenderer,
            valueGetter: ({ data }) => {
              if (!data) return null;
              const sales = data.monthlySales as { month: string; sold: number }[];
              const recent3 = sales
                .slice(-3)
                .reduce((s: number, m) => s + m.sold, 0);
              const prior3 = sales
                .slice(-6, -3)
                .reduce((s: number, m) => s + m.sold, 0);
              return prior3 > 0 ? ((recent3 - prior3) / prior3) * 100 : 0;
            },
            filter: "agNumberColumnFilter",
          },
        ],
      },

      // ===== FINANCIALS (Reordered: Revenue & Margin first) =====
      {
        headerName: "Financials",
        children: [
          {
            headerName: "Revenue (12m)",
            valueGetter: ({ data }) =>
              data
                ? data.monthlySales.reduce(
                    (sum: number, m: { sold: number }) =>
                      sum + m.sold * data.price,
                    0
                  )
                : undefined,
            valueFormatter: ({ value, data }) =>
              value != null
                ? `${data?.currency ?? "$"} ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
                : "",
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            minWidth: 130,
          },
          {
            headerName: "Margin %",
            valueGetter: ({ data }) =>
              data ? ((data.price - data.cost) / data.price) * 100 : null,
            cellRenderer: MarginBarRenderer,
            aggFunc: "avg",
            filter: "agNumberColumnFilter",
            minWidth: 140,
          },
          {
            headerName: "Price",
            field: "price",
            valueFormatter: ({ value, data }) =>
              value != null
                ? `${data?.currency ?? "$"} ${Number(value).toFixed(2)}`
                : "",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Cost",
            field: "cost",
            valueFormatter: ({ value, data }) =>
              value != null
                ? `${data?.currency ?? "$"} ${Number(value).toFixed(2)}`
                : "",
            filter: "agNumberColumnFilter",
          },
        ],
      },

      // ===== INVENTORY (Reordered: Days of Stock first) =====
      {
        headerName: "Inventory",
        children: [
          {
            headerName: "Days of Stock",
            colId: "daysOfStock",
            minWidth: 130,
            cellRenderer: DaysOfStockRenderer,
            valueGetter: ({ data }) => {
              if (!data) return null;
              if (data.isDigital) return { days: 0, isDigital: true };
              const totalStock = Object.values(
                data.stockByWarehouse as Record<string, number>
              ).reduce((a, b) => a + b, 0);
              const velocity =
                data.monthlySales.reduce(
                  (s: number, m: { sold: number }) => s + m.sold,
                  0
                ) / 12;
              const days =
                velocity > 0 ? Math.round((totalStock / velocity) * 30) : 999;
              return { days, isDigital: false };
            },
            comparator: (valueA, valueB) => {
              const daysA = valueA?.isDigital ? 999 : valueA?.days ?? 0;
              const daysB = valueB?.isDigital ? 999 : valueB?.days ?? 0;
              return daysA - daysB;
            },
            filter: "agNumberColumnFilter",
            filterValueGetter: ({ data }) => {
              if (!data || data.isDigital) return null;
              const totalStock = Object.values(
                data.stockByWarehouse as Record<string, number>
              ).reduce((a, b) => a + b, 0);
              const velocity =
                data.monthlySales.reduce(
                  (s: number, m: { sold: number }) => s + m.sold,
                  0
                ) / 12;
              return velocity > 0
                ? Math.round((totalStock / velocity) * 30)
                : 999;
            },
          },
          {
            headerName: "Stock (Total)",
            valueGetter: ({ data }) =>
              data
                ? Object.values(
                    data.stockByWarehouse as Record<string, number>
                  ).reduce((a, b) => a + b, 0)
                : undefined,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Stock by Warehouse",
            minWidth: 140,
            cellRenderer: "agSparklineCellRenderer",
            cellRendererParams: {
              sparklineOptions: {
                type: "bar",
                direction: "horizontal",
                fill: "#4F46E5",
                stroke: "#4F46E5",
                padding: { top: 8, bottom: 8, left: 4, right: 4 },
                label: {
                  enabled: true,
                  placement: "outside-end",
                  fontSize: 9,
                  color: "#64748B",
                },
                highlightStyle: {
                  fill: "#6366F1",
                  stroke: "#6366F1",
                },
              } as AgSparklineOptions,
            },
            valueGetter: ({ data }) =>
              data
                ? Object.values(data.stockByWarehouse as Record<string, number>)
                : [],
          },
          {
            headerName: "Incoming",
            valueGetter: ({ data }) =>
              data
                ? Object.values(
                    data.incomingByWarehouse as Record<string, number>
                  ).reduce((a, b) => a + b, 0)
                : undefined,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
          },
        ],
      },

      // ===== SALES PERFORMANCE (Collapsible with monthly details) =====
      {
        headerName: "Sales Performance",
        openByDefault: false,
        children: [
          {
            headerName: "Sales Trend",
            minWidth: 150,
            cellRenderer: "agSparklineCellRenderer",
            cellRendererParams: {
              sparklineOptions: {
                type: "area",
                fill: "rgba(79, 70, 229, 0.1)",
                stroke: "#4F46E5",
                strokeWidth: 2,
                padding: { top: 8, bottom: 8, left: 4, right: 4 },
                marker: {
                  enabled: false,
                },
                highlightStyle: {
                  fill: "#4F46E5",
                  stroke: "#4F46E5",
                  strokeWidth: 2,
                },
              } as AgSparklineOptions,
            },
            valueGetter: ({ data }) =>
              data?.monthlySales.map((m: { sold: number }) => m.sold) ?? [],
            columnGroupShow: "closed",
          },
          {
            headerName: "Units Sold (12m)",
            valueGetter: ({ data }) =>
              data
                ? data.monthlySales.reduce(
                    (sum: number, m: { sold: number }) => sum + m.sold,
                    0
                  )
                : undefined,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "closed",
          },
          {
            headerName: "Velocity (avg / mo)",
            valueGetter: ({ data }) =>
              data
                ? data.monthlySales.reduce(
                    (s: number, m: { sold: number }) => s + m.sold,
                    0
                  ) / 12
                : undefined,
            valueFormatter: ({ value }) =>
              typeof value === "number" ? value.toFixed(1) : "",
            aggFunc: "avg",
            filter: "agNumberColumnFilter",
            columnGroupShow: "closed",
          },
          {
            headerName: "Feb '25",
            colId: "sales-2025-02",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-02"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Mar '25",
            colId: "sales-2025-03",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-03"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Apr '25",
            colId: "sales-2025-04",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-04"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "May '25",
            colId: "sales-2025-05",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-05"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Jun '25",
            colId: "sales-2025-06",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-06"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Jul '25",
            colId: "sales-2025-07",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-07"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Aug '25",
            colId: "sales-2025-08",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-08"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Sep '25",
            colId: "sales-2025-09",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-09"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Oct '25",
            colId: "sales-2025-10",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-10"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Nov '25",
            colId: "sales-2025-11",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-11"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Dec '25",
            colId: "sales-2025-12",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2025-12"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
          {
            headerName: "Jan '26",
            colId: "sales-2026-01",
            valueGetter: ({ data }) =>
              data?.monthlySales.find(
                (m: { month: string }) => m.month === "2026-01"
              )?.sold ?? 0,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            columnGroupShow: "open",
          },
        ],
      },

      // ===== CUSTOMER FEEDBACK =====
      {
        headerName: "Customer Feedback",
        children: [
          {
            headerName: "Rating",
            field: "avgRating",
            cellRenderer: RatingRenderer,
            aggFunc: "avg",
            filter: "agNumberColumnFilter",
            minWidth: 130,
          },
          {
            headerName: "Reviews",
            field: "reviewCount",
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
          },
        ],
      },

      // ===== PRODUCT DETAILS (Secondary info) =====
      {
        headerName: "Product Details",
        openByDefault: false,
        children: [
          {
            headerName: "Category",
            field: "category",
            enableRowGroup: true,
            filter: "agSetColumnFilter",
          },
          {
            headerName: "Subcategory",
            field: "subcategory",
            enableRowGroup: true,
            filter: "agSetColumnFilter",
          },
          {
            headerName: "Brand / Artist",
            field: "brand",
            minWidth: 160,
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Digital",
            field: "isDigital",
            cellRenderer: ({ value }: { value: boolean }) =>
              value ? "Yes" : "No",
            filter: "agSetColumnFilter",
          },
          {
            headerName: "Launch Date",
            field: "launchDate",
            valueFormatter: ({ value }: { value: string }) =>
              value
                ? new Date(value).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "",
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Currency",
            field: "currency",
            filter: "agSetColumnFilter",
          },
          {
            headerName: "Price Δ",
            field: "priceChange",
            cellRenderer: PriceChangeRenderer,
            filter: "agNumberColumnFilter",
            minWidth: 100,
          },
          {
            headerName: "Primary WH",
            field: "primaryWarehouse",
            minWidth: 140,
            filter: "agSetColumnFilter",
          },
          {
            headerName: "Variants",
            valueGetter: ({ data }) => data?.variants.length ?? undefined,
            aggFunc: "avg",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "US-West Stock",
            field: "stockByWarehouse.US-West",
            valueGetter: ({ data }) =>
              data
                ? (data.stockByWarehouse as Record<string, number>)[
                    "US-West"
                  ] ?? 0
                : undefined,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            cellStyle: ({ value }) =>
              value != null && value < 10
                ? { backgroundColor: "#FEF2F2", color: "#991B1B" }
                : null,
          },
          {
            headerName: "EU-Central Stock",
            field: "stockByWarehouse.EU-Central",
            valueGetter: ({ data }) =>
              data
                ? (data.stockByWarehouse as Record<string, number>)[
                    "EU-Central"
                  ] ?? 0
                : undefined,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            cellStyle: ({ value }) =>
              value != null && value < 10
                ? { backgroundColor: "#FEF2F2", color: "#991B1B" }
                : null,
          },
          {
            headerName: "Asia-East Stock",
            field: "stockByWarehouse.Asia-East",
            valueGetter: ({ data }) =>
              data
                ? (data.stockByWarehouse as Record<string, number>)[
                    "Asia-East"
                  ] ?? 0
                : undefined,
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
            cellStyle: ({ value }) =>
              value != null && value < 10
                ? { backgroundColor: "#FEF2F2", color: "#991B1B" }
                : null,
          },
        ],
      },
    ];
  }, []);

  // Handler for KPI low stock click
  const handleKpiLowStockClick = useCallback(() => {
    const api = gridRef.current?.api;
    if (!api || isPivotMode) return;

    // Filter to show any product with low stock in any warehouse
    api.setFilterModel(null);

    // Apply a custom filter - we'll filter by US-West as an example
    api.setColumnFilterModel("stockByWarehouse.US-West", {
      filterType: "number",
      type: "lessThan",
      filter: 10,
    });

    api.onFilterChanged();
  }, [isPivotMode]);

  return (
    <div style={gridStyle} className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1 className={styles.headerTitle}>Ecommerce Inventory</h1>
          <span className={styles.headerSubtitle}>Product Performance Dashboard</span>
        </div>
      </div>

      {/* KPI Dashboard */}
      <KpiDashboard data={rowData} onFilterLowStock={handleKpiLowStockClick} />

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <span className={styles.controlGroupLabel}>View</span>
          <button
            className={styles.actionButton}
            onClick={handleGroupByCategory}
            disabled={isPivotMode}
          >
            Group By Category
          </button>
          <select
            className={styles.actionButton}
            value={pivotDimension}
            onChange={(e) =>
              setPivotDimension(e.target.value as "month" | "warehouse")
            }
            disabled={isPivotMode}
          >
            <option value="month">Pivot: By Month</option>
            <option value="warehouse">Pivot: By Warehouse</option>
          </select>
          <button
            className={`${styles.actionButton} ${styles.actionButtonPrimary}`}
            onClick={handlePivotMode}
            disabled={isPivotMode}
          >
            Enter Pivot Mode
          </button>
        </div>

        <div className={styles.controlDivider} />

        <div className={styles.controlGroup}>
          <span className={styles.controlGroupLabel}>Filters</span>
          <select
            className={styles.actionButton}
            value={selectedWarehouse}
            onChange={(e) => setSelectedWarehouse(e.target.value)}
            disabled={isPivotMode}
          >
            {warehouses.map((wh) => (
              <option key={wh} value={wh}>
                {wh}
              </option>
            ))}
          </select>
          <button
            className={`${styles.actionButton} ${styles.actionButtonDanger}`}
            onClick={handleFilterLowStock}
            disabled={isPivotMode}
          >
            Low Stock
          </button>
          <select
            className={styles.actionButton}
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            disabled={isPivotMode}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <button
            className={`${styles.actionButton} ${styles.actionButtonDanger}`}
            onClick={handleFilterLowSales}
            disabled={isPivotMode}
          >
            Low Sales
          </button>
        </div>

        <div className={styles.controlDivider} />

        <button className={styles.actionButton} onClick={handleReset}>
          Reset All
        </button>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        <AgGridReact
          theme={theme}
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          autoSizeStrategy={autoSizeStrategy}
          sideBar={["columns", "filters"]}
          grandTotalRow="bottom"
          groupTotalRow="bottom"
          alwaysMultiSort={true}
          cellSelection
          rowSelection={{ mode: "multiRow", checkboxes: true, headerCheckbox: true }}
          masterDetail={true}
          detailRowAutoHeight={true}
          detailCellRendererParams={{
            detailGridOptions: {
              columnDefs: [
                { field: "variantId", headerName: "Variant ID", flex: 1 },
                { field: "format", headerName: "Format", flex: 1 },
                { field: "available", headerName: "Available", flex: 1 },
              ],
            },
            getDetailRowData: (params: GetDetailRowDataParams) => {
              params.successCallback(params.data.variants);
            },
          }}
          statusBar={{
            statusPanels: [
              {
                statusPanel: "agTotalAndFilteredRowCountComponent",
                align: "left",
              },
              { statusPanel: "agSelectedRowCountComponent", align: "center" },
              { statusPanel: "agAggregationComponent", align: "right" },
            ],
          }}
        />
      </div>
    </div>
  );
}
