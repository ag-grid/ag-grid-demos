import { CSSProperties } from "react";
import styles from "./EcommerceExample.module.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState } from "react";
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
} from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  SideBarModule,
  ColumnsToolPanelModule,
  RowGroupingModule,
]);

export default function EcommerceExample() {
  const gridStyle: CSSProperties = {
    height: "100vh",
    width: "100%",
  };

  const theme = useMemo(() => themeQuartz, []);

  const gridRef = useRef<AgGridReact>(null);
  const [rowData] = useState(getData());

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
      // enableRowGroup: true,
      // enableValue: true,
    }),
    []
  );

  const colDefs = useMemo<ColDef[]>(() => {
    return [
      {
        headerName: "Category",
        field: "category",
        rowGroup: true,
        hide: true,
      },
      {
        headerName: "Subcategory",
        field: "subcategory",
        rowGroup: true,
        hide: true,
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
        headerName: "Brand / Artist",
        field: "brand",
        minWidth: 160,
      },
      {
        headerName: "Price",
        field: "price",
        valueFormatter: ({ value, data }) =>
          value != null ? `${data.currency} ${Number(value).toFixed(2)}` : "",
      },
      {
        headerName: "Cost",
        field: "cost",
        valueFormatter: ({ value, data }) =>
          value != null ? `${data.currency} ${Number(value).toFixed(2)}` : "",
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
        headerName: "Stock (Total)",
        valueGetter: ({ data }) =>
          data
            ? Object.values(data.stockByWarehouse).reduce((a, b) => a + b, 0)
            : 0,
        aggFunc: "sum",
      },
      {
        headerName: "Incoming",
        valueGetter: ({ data }) =>
          data
            ? Object.values(data.incomingByWarehouse).reduce((a, b) => a + b, 0)
            : 0,
        aggFunc: "sum",
      },
      {
        headerName: "Primary WH",
        field: "primaryWarehouse",
        minWidth: 140,
      },
      {
        headerName: "Units Sold (12m)",
        valueGetter: ({ data }) =>
          data ? data.monthlySales.reduce((sum, m) => sum + m.sold, 0) : 0,
        aggFunc: "sum",
      },
      {
        headerName: "Revenue (12m)",
        valueGetter: ({ data }) =>
          data
            ? data.monthlySales.reduce((sum, m) => sum + m.sold * data.price, 0)
            : 0,
        valueFormatter: ({ value, data }) =>
          value != null ? `${data.currency} ${value.toFixed(0)}` : "",
        aggFunc: "sum",
      },
      {
        headerName: "Velocity (avg / mo)",
        valueGetter: ({ data }) =>
          data ? data.monthlySales.reduce((s, m) => s + m.sold, 0) / 12 : 0,
        valueFormatter: ({ value }) => value?.toFixed(1),
        aggFunc: "avg",
      },
      {
        headerName: "Variants",
        valueGetter: ({ data }) => data?.variants.length ?? 0,
        aggFunc: "avg",
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
    ];
  }, []);

  return (
    <div style={gridStyle} className={`${styles.container}`}>
      <div className={`${styles.grid}`}>
        <AgGridReact
          theme={theme}
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          autoSizeStrategy={autoSizeStrategy}
          sideBar={"columns"}
        />
      </div>
    </div>
  );
}
