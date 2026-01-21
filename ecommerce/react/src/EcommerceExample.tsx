import { CSSProperties } from "react";
import styles from "./EcommerceExample.module.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState, useCallback } from "react";
import { getData } from "./data";
import {
  themeQuartz,
  ColDef,
  ColGroupDef,
  AutoSizeStrategy,
  ModuleRegistry,
  TextFilterModule,
  NumberFilterModule,
} from "ag-grid-community";
import {
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  PivotModule,
  SetFilterModule,
  FiltersToolPanelModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  PivotModule,
  TextFilterModule,
  NumberFilterModule,
  SetFilterModule,
  FiltersToolPanelModule,
]);

export default function EcommerceExample() {
  const gridStyle: CSSProperties = {
    height: "100vh",
    width: "100%",
  };

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
      {
        headerName: "Product Info",
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
          {
            headerName: "Brand / Artist",
            field: "brand",
            minWidth: 160,
            filter: "agTextColumnFilter",
          },
          {
            headerName: "Status",
            field: "status",
            cellRenderer: ({ value }: { value: string }) =>
              value ? value.charAt(0).toUpperCase() + value.slice(1) : "",
            filter: "agSetColumnFilter",
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
        ],
      },
      {
        headerName: "Financials",
        children: [
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
          {
            headerName: "Currency",
            field: "currency",
            filter: "agSetColumnFilter",
          },
          {
            headerName: "Margin %",
            valueGetter: ({ data }) =>
              data ? ((data.price - data.cost) / data.price) * 100 : null,
            valueFormatter: ({ value }) =>
              value != null ? `${Number(value).toFixed(1)}%` : "",
            aggFunc: "avg",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Price Δ",
            field: "priceChange",
            valueFormatter: ({ value }) => (value > 0 ? `+${value}` : value),
            filter: "agNumberColumnFilter",
          },
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
                ? `${data?.currency ?? "$"} ${value.toFixed(0)}`
                : "",
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
          },
        ],
      },
      {
        headerName: "Inventory",
        children: [
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
        ],
      },
      {
        headerName: "Sales Performance",
        openByDefault: false,
        children: [
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
      {
        headerName: "Customer Feedback",
        children: [
          {
            headerName: "Rating",
            field: "avgRating",
            aggFunc: "avg",
            filter: "agNumberColumnFilter",
          },
          {
            headerName: "Reviews",
            field: "reviewCount",
            aggFunc: "sum",
            filter: "agNumberColumnFilter",
          },
        ],
      },
    ];
  }, []);

  return (
    <div style={gridStyle} className={`${styles.container}`}>
      <div className={styles.actions}>
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
          <option value="month">By Month</option>
          <option value="warehouse">By Warehouse</option>
        </select>
        <button
          className={styles.actionButton}
          onClick={handlePivotMode}
          disabled={isPivotMode}
        >
          Pivot Mode
        </button>
        <button className={styles.actionButton} onClick={handleReset}>
          Reset
        </button>
      </div>
      <div className={styles.actions}>
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
          className={styles.actionButton}
          onClick={handleFilterLowStock}
          disabled={isPivotMode}
        >
          Filter Low Stock
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
          className={styles.actionButton}
          onClick={handleFilterLowSales}
          disabled={isPivotMode}
        >
          Filter Low Sales
        </button>
      </div>
      <div className={`${styles.grid}`}>
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
        />
      </div>
    </div>
  );
}
