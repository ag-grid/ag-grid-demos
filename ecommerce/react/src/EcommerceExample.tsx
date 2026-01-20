import { CSSProperties } from "react";
import styles from "./EcommerceExample.module.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState, useCallback } from "react";
import { getData } from "./data";
import {
  themeQuartz,
  ColDef,
  AutoSizeStrategy,
  ModuleRegistry,
} from "ag-grid-community";
import {
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  PivotModule,
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
  PivotModule,
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
  const [pivotDimension, setPivotDimension] = useState<"month" | "warehouse">("month");

  // Flatten data by month for pivot mode
  const flattenByMonth = useCallback((data: ReturnType<typeof getData>) => {
    return data.flatMap((product) =>
      product.monthlySales.map((sale) => ({
        ...product,
        month: sale.month,
        monthLabel: new Date(sale.month + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
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
        stock: (product.stockByWarehouse as Record<string, number>)[warehouse] ?? 0,
        incoming: (product.incomingByWarehouse as Record<string, number>)[warehouse] ?? 0,
        // Allocate revenue proportionally by stock
        unitsSold: Math.round(
          product.monthlySales.reduce((sum, m) => sum + m.sold, 0) *
          ((product.stockByWarehouse as Record<string, number>)[warehouse] ?? 0) /
          Math.max(1, Object.values(product.stockByWarehouse as Record<string, number>).reduce((a, b) => a + b, 0))
        ),
        revenue: Math.round(
          product.monthlySales.reduce((sum, m) => sum + m.sold * product.price, 0) *
          ((product.stockByWarehouse as Record<string, number>)[warehouse] ?? 0) /
          Math.max(1, Object.values(product.stockByWarehouse as Record<string, number>).reduce((a, b) => a + b, 0))
        ),
      }))
    );
  }, []);

  const autoSizeStrategy = useMemo<AutoSizeStrategy>(() => {
    return {
      type: "fitCellContents",
      defaultMaxWidth: 150,
      defaultMinWidth: 80,
    };
  }, []);
  const defaultColDef = useMemo<ColDef>(
    () => ({
      // flex: 1,
      filter: true,
      // enableValue: true,
    }),
    []
  );

  const handleGroupByCategory = () => {
    const api = gridRef.current?.api;
    if (!api) return;

    const updatedColDefs = colDefs.map((col) => {
      if (col.field === "category" || col.field === "subcategory") {
        return { ...col, rowGroup: true, hide: true };
      }
      if (col.field === "sku") {
        return { ...col, hide: true };
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
  };

  // Pivot column definitions for month-based pivot
  const pivotColDefsMonth = useMemo<ColDef[]>(() => {
    return [
      { headerName: "Category", field: "category", rowGroup: true, hide: true, enableRowGroup: true },
      { headerName: "Subcategory", field: "subcategory", rowGroup: true, hide: true, enableRowGroup: true },
      { headerName: "Product", field: "product", rowGroup: true, hide: true, enableRowGroup: true },
      { headerName: "Month", field: "monthLabel", pivot: true, enablePivot: true },
      { headerName: "Revenue", field: "revenue", aggFunc: "sum", enableValue: true },
      { headerName: "Units Sold", field: "unitsSold", aggFunc: "sum", enableValue: true },
    ];
  }, []);

  // Pivot column definitions for warehouse-based pivot
  const pivotColDefsWarehouse = useMemo<ColDef[]>(() => {
    return [
      { headerName: "Category", field: "category", rowGroup: true, hide: true, enableRowGroup: true },
      { headerName: "Subcategory", field: "subcategory", rowGroup: true, hide: true, enableRowGroup: true },
      { headerName: "Product", field: "product", rowGroup: true, hide: true, enableRowGroup: true },
      { headerName: "Warehouse", field: "warehouse", pivot: true, enablePivot: true },
      { headerName: "Revenue", field: "revenue", aggFunc: "sum", enableValue: true },
      { headerName: "Units Sold", field: "unitsSold", aggFunc: "sum", enableValue: true },
      { headerName: "Stock", field: "stock", aggFunc: "sum", enableValue: true },
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

  const colDefs = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: "Category",
        field: "category",
        enableRowGroup: true,
      },
      {
        headerName: "Subcategory",
        field: "subcategory",
        enableRowGroup: true,
      },
      {
        headerName: "Product",
        field: "product",
        pinned: "left",
        minWidth: 220,
        cellRenderer: "agGroupCellRenderer",
      },
      {
        headerName: "SKU",
        field: "sku",
        pinned: "left",
        minWidth: 140,
      },
      {
        headerName: "Revenue (12m)",
        valueGetter: ({ data }) =>
          data
            ? data.monthlySales.reduce(
                (sum: number, m: { sold: number }) => sum + m.sold * data.price,
                0
              )
            : undefined,
        valueFormatter: ({ value, data }) =>
          value != null ? `${data?.currency ?? "$"} ${value.toFixed(0)}` : "",
        aggFunc: "sum",
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
      },
      {
        headerName: "Rating",
        field: "avgRating",
        aggFunc: "avg",
      },
      {
        headerName: "Reviews",
        field: "reviewCount",
        aggFunc: "sum",
      },
      {
        headerName: "Brand / Artist",
        field: "brand",
        minWidth: 160,
      },
      {
        headerName: "Price",
        field: "price",
        valueFormatter: ({ value, data }) =>
          value != null
            ? `${data?.currency ?? "$"} ${Number(value).toFixed(2)}`
            : "",
      },
      {
        headerName: "Cost",
        field: "cost",
        valueFormatter: ({ value, data }) =>
          value != null
            ? `${data?.currency ?? "$"} ${Number(value).toFixed(2)}`
            : "",
      },
      {
        headerName: "Margin %",
        valueGetter: ({ data }) =>
          data ? ((data.price - data.cost) / data.price) * 100 : null,
        valueFormatter: ({ value }) =>
          value != null ? `${Number(value).toFixed(1)}%` : "",
        aggFunc: "avg",
      },

      {
        headerName: "Price Δ",
        field: "priceChange",
        valueFormatter: ({ value }) => (value > 0 ? `+${value}` : value),
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
      },
      {
        headerName: "Primary WH",
        field: "primaryWarehouse",
        minWidth: 140,
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
      },
      {
        headerName: "Variants",
        valueGetter: ({ data }) => data?.variants.length ?? undefined,
        aggFunc: "avg",
      },
    ];
  }, []);

  return (
    <div style={gridStyle} className={`${styles.container}`}>
      <div className={styles.actions}>
        <button className={styles.actionButton} onClick={handleGroupByCategory} disabled={isPivotMode}>
          Group By Category
        </button>
        <select
          className={styles.actionButton}
          value={pivotDimension}
          onChange={(e) => setPivotDimension(e.target.value as "month" | "warehouse")}
          disabled={isPivotMode}
        >
          <option value="month">By Month</option>
          <option value="warehouse">By Warehouse</option>
        </select>
        <button className={styles.actionButton} onClick={handlePivotMode} disabled={isPivotMode}>
          Pivot Mode
        </button>
        <button className={styles.actionButton} onClick={handleReset}>
          Reset
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
          sideBar={"columns"}
          grandTotalRow="bottom"
          groupTotalRow="bottom"
        />
      </div>
    </div>
  );
}
