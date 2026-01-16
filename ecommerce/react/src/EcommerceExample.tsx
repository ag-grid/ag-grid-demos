import { CSSProperties } from "react";
import styles from "./EcommerceExample.module.css";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState } from "react";
import { getData } from "./data";
import { themeQuartz, ColDef, AutoSizeStrategy } from "ag-grid-community";
import { ProductImageCellRenderer } from "./cell-renderers/ProductImageCellRenderer";
import "ag-grid-enterprise";

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

  const columnDefs = useMemo(
    () => [
      { field: "product", headerName: "Product", sortable: true, filter: true },
      { field: "sku", headerName: "SKU", sortable: true },
      { field: "artist", headerName: "Artist", sortable: true, filter: true },
      {
        field: "category",
        headerName: "Category",
        sortable: true,
        filter: true,
      },
      {
        field: "subcategory",
        headerName: "Subcategory",
        sortable: true,
        filter: true,
      },
      {
        field: "launchYear",
        headerName: "Launch Year",
        sortable: true,
        filter: true,
      },
      { field: "status", headerName: "Status", sortable: true, filter: true },
      {
        field: "isDigital",
        headerName: "Digital",
        sortable: true,
        filter: true,
      },
      { field: "price", headerName: "Price ($)", sortable: true, filter: true },
      { field: "cost", headerName: "Cost ($)", sortable: true, filter: true },
      {
        field: "margin",
        headerName: "Margin (%)",
        sortable: true,
        filter: true,
      },
      {
        field: "priceIncrease",
        headerName: "Price Increase ($)",
        sortable: true,
      },
      {
        field: "availableTotal",
        headerName: "Available Total",
        sortable: true,
      },
      { field: "incomingTotal", headerName: "Incoming Total", sortable: true },
      { field: "availableUS", headerName: "Available US", sortable: true },
      { field: "availableEU", headerName: "Available EU", sortable: true },
      { field: "availableAsia", headerName: "Available Asia", sortable: true },
      {
        field: "warehousePrimary",
        headerName: "Primary Warehouse",
        sortable: true,
      },
      { field: "soldTotal", headerName: "Sold Total", sortable: true },
      { field: "soldUS", headerName: "Sold US", sortable: true },
      { field: "soldEU", headerName: "Sold EU", sortable: true },
      { field: "soldAsia", headerName: "Sold Asia", sortable: true },
      {
        field: "revenueTotal",
        headerName: "Revenue Total ($)",
        sortable: true,
      },
      {
        field: "avgRating",
        headerName: "Avg Rating",
        sortable: true,
        filter: true,
      },
      { field: "reviewCount", headerName: "Review Count", sortable: true },
      { field: "variantsCount", headerName: "Variants Count", sortable: true },
      {
        field: "variantDetails",
        headerName: "Variant Details",
        cellRenderer: (params) => {
          if (!params.value) return "";
          return params.value
            .map(
              (variant) =>
                `${variant.title} (${variant.format}, ${variant.year})`
            )
            .join(", ");
        },
      },
      {
        field: "image",
        headerName: "Image",
        cellRenderer: ProductImageCellRenderer,
        width: 60,
      },
      {
        headerName: "Monthly Sales",
        marryChildren: true,
        children: [
          {
            headerName: "Total",
            columnGroupShow: "closed",
            children: [
              { field: "soldTotal", headerName: "Sold" },
              { field: "revenueTotal", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "January",
            columnGroupShow: "open",
            children: [
              { field: "soldJan", headerName: "Sold" },
              { field: "revenueJan", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "February",
            columnGroupShow: "open",
            children: [
              { field: "soldFeb", headerName: "Sold" },
              { field: "revenueFeb", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "March",
            columnGroupShow: "open",
            children: [
              { field: "soldMar", headerName: "Sold" },
              { field: "revenueMar", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "April",
            columnGroupShow: "open",
            children: [
              { field: "soldApr", headerName: "Sold" },
              { field: "revenueApr", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "May",
            columnGroupShow: "open",
            children: [
              { field: "soldMay", headerName: "Sold" },
              { field: "revenueMay", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "June",
            columnGroupShow: "open",
            children: [
              { field: "soldJun", headerName: "Sold" },
              { field: "revenueJun", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "July",
            columnGroupShow: "open",
            children: [
              { field: "soldJul", headerName: "Sold" },
              { field: "revenueJul", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "August",
            columnGroupShow: "open",
            children: [
              { field: "soldAug", headerName: "Sold" },
              { field: "revenueAug", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "September",
            columnGroupShow: "open",
            children: [
              { field: "soldSep", headerName: "Sold" },
              { field: "revenueSep", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "October",
            columnGroupShow: "open",
            children: [
              { field: "soldOct", headerName: "Sold" },
              { field: "revenueOct", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "November",
            columnGroupShow: "open",
            children: [
              { field: "soldNov", headerName: "Sold" },
              { field: "revenueNov", headerName: "Revenue ($)" },
            ],
          },
          {
            headerName: "December",
            columnGroupShow: "open",
            children: [
              { field: "soldDec", headerName: "Sold" },
              { field: "revenueDec", headerName: "Revenue ($)" },
            ],
          },
        ],
      },
    ],
    []
  );

  return (
    <div style={gridStyle} className={`${styles.container}`}>
      <div className={`${styles.grid}`}>
        <AgGridReact
          theme={theme}
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          autoSizeStrategy={autoSizeStrategy}
          // skipHeaderOnAutoSize
        />
      </div>
    </div>
  );
}
