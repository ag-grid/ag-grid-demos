import type {
  ColDef,
  GetDetailRowDataParams,
  SizeColumnsToFitGridStrategy,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import {
  ExcelExportModule,
  MasterDetailModule,
  MultiFilterModule,
  RowGroupingModule,
  SetFilterModule,
  RowGroupingPanelModule,
  TreeDataModule,
  SideBarModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import {
  type ChangeEvent,
  type FunctionComponent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./InventoryExample.module.css";
import { getData } from "./data";
import { ActionsCellRenderer } from "./cell-renderers/ActionsCellRenderer";
import { ProductCellRenderer } from "./cell-renderers/ProductCellRenderer";
import { StatusCellRenderer } from "./cell-renderers/StatusCellRenderer";
import { StockCellRenderer } from "./cell-renderers/StockCellRenderer";
import { PriceCellRenderer } from "./cell-renderers/PriceCellRenderer";

ModuleRegistry.registerModules([
  TreeDataModule,
  AllCommunityModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  SetFilterModule,
  MultiFilterModule,
  MasterDetailModule,
  RowGroupingModule, // <-- Add this line
  RowGroupingPanelModule, // <-- Add this line if you want to use the row grouping panel
]);

interface Props {
  gridTheme?: string;
  isDarkMode?: boolean;
}

const paginationPageSizeSelector = [5, 10, 20];

const statuses = {
  all: "All",
  draft: "Draft",

  paused: "Pending",
  active: "Approved",

};

const statusFormatter: ValueFormatterFunc = ({ value }) =>
  statuses[(value as string)?.toLowerCase() as keyof typeof statuses] ?? value ?? "";

export const InventoryExample: FunctionComponent<Props> = ({
  gridTheme = "ag-theme-balham",
  isDarkMode,
}) => {
  const gridRef = useRef<AgGridReact>(null);

  const [colDefs] = useState<ColDef[]>([
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
      cellClass: "cell-actions",
      width: 180,

      minWidth: 180,

    }
    ,
    {
      headerName: "Quotation",

      headerClass: "quotation-group-header",
      children: [
        {
          field: "quotationID",
          headerName: "Quotation ID",
          cellRenderer: "agGroupCellRenderer",
          enableRowGroup: true,
          headerClass: "header-sku",
          minWidth: 100,
          filter: true,
        },
        { field: "quantity", type: "rightAligned", maxWidth: 100 },
        {
          field: "status",
          hide: true,
          valueFormatter: statusFormatter,
          cellRenderer: StatusCellRenderer,
          filter: true,
          filterParams: {
            valueFormatter: statusFormatter,
          },
          headerClass: "header-status",
        },
        { field: "lastQuotationAt", width: 150, headerClass: "Last Quotation At" },
        { field: "dateCreated", headerName: "Created at", type: "date", flex: 1 },
        { field: "dateSubmitted", headerName: "Submitted at", type: "date", flex: 1 },

      ],
    },
    {
      headerName: "Customer",
      headerClass: "customer-group-header",
      children: [
        { field: "customerID", headerName: "Customer ID", enableRowGroup: true, minWidth: 80, filter: true },
        { field: "customerName", headerName: "Name", enableRowGroup: true, minWidth: 80, filter: true },
        { field: "phone", headerName: "Phone", minWidth: 100, filter: true },
        { field: "email", headerName: "Email", minWidth: 100, filter: true },
      ],
    },
    {
      headerName: "Specification",
      headerClass: "specification-group-header",
      children: [
        { field: "quantity", headerName: "Quantity", enableRowGroup: true, minWidth: 80, filter: true },
        { field: "size", headerName: "Size", enableRowGroup: true, minWidth: 80, filter: true },
        { field: "die", headerName: "Die", enableRowGroup: true, minWidth: 80, filter: true },
        { field: "noOfLots", headerName: "Phone", minWidth: 100, filter: true },

      ],
    },

  ]);
  const [rowData] = useState(getData());
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: false,
    }),
    []
  );
  const autoSizeStrategy = useMemo<SizeColumnsToFitGridStrategy>(
    () => ({
      type: "fitGridWidth",
    }),
    []
  );
  const themeClass = isDarkMode ? `${gridTheme}-dark` : gridTheme;
  const [quickFilterText, setQuickFilterText] = useState<string>();
  const onFilterTextBoxChanged = useCallback(
    ({ target: { value } }: ChangeEvent<HTMLInputElement>) =>
      setQuickFilterText(value),
    []
  );

  const detailCellRendererParams = useMemo(
    () => ({
      detailGridOptions: {
        treeData: true,
        getDataPath: (data: any) => data.path, // AG Grid uses this for tree structure
        autoGroupColumnDef: {
          headerName: "Title",
          field: "title",
          cellRendererParams: { suppressCount: true },
          flex: 2,
        },
        columnDefs: [
          { field: "col1", filter: true, headerName: "Col1", flex: 1 },
          { field: "col2", filter: true, headerName: "Col2", flex: 1 },
          { field: "col3", filter: true, headerName: "Col3", flex: 1 },
          { field: "col4", filter: true, headerName: "Col4", flex: 1 },
        ],
        groupDefaultExpanded: 0,
      },
      getDetailRowData: ({ successCallback, data }: GetDetailRowDataParams) => {
        // Recursively add a 'path' property to each node
        function addPath(nodes: any[], parentPath: string[] = []) {
          return nodes.map(node => {
            const path = [...parentPath, node.title];
            const newNode = { ...node, path };
            if (node.children) {
              newNode.children = addPath(node.children, path);
            }
            return newNode;
          });
        }
        // Flatten the tree into a single array for AG Grid
        function flatten(nodes: any[]): any[] {
          return nodes.reduce((acc, node) => {
            acc.push(node);
            if (node.children) {
              acc.push(...flatten(node.children));
            }
            return acc;
          }, []);
        }
        const treeData = Array.isArray(data.variantDetails)
          ? flatten(addPath(data.variantDetails))
          : [];
        successCallback(treeData);
      },
    }),
    []
  );
  const [activeTab, setActiveTab] = useState("all");
  const handleTabClick = useCallback((status: string) => {
    setActiveTab(status);
    gridRef
      .current!.api.setColumnFilterModel(
        "status",
        status === "all" ? null : { values: [status] }
      )
      .then(() => gridRef.current!.api.onFilterChanged());
  }, []);

  // Remove the tab page for master grid and show only the main table

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.exampleHeader}>
          <div className={styles.tabs}>
            {Object.entries(statuses).map(([key, displayValue]) => {
              let borderColor = "transparent";
              if (key === "active") borderColor = "#43a047";
              else if (key === "paused") borderColor = "#ff9900";
              else if (key.toLocaleLowerCase() === "draft") borderColor = "#757575"; // ash

              return (
                <button
                  className={`${styles.tabButton} ${activeTab === key ? styles.active : ""}`}
                  onClick={() => handleTabClick(key)}
                  key={key}
                  style={{
                    borderLeft: `4px solid ${borderColor}`,
                    borderRadius: 0,
                    textAlign: "center",
                    boxSizing: "border-box",
                    background: "#fff",
                    color: "#222",
                    cursor: "pointer",
                  }}
                >
                  {displayValue}
                </button>
              );
            })}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className={styles.inputWrapper} style={{ margin: 0 }}>
              <svg
                className={styles.searchIcon}
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M11.5014 7.00039C11.5014 7.59133 11.385 8.1765 11.1588 8.72246C10.9327 9.26843 10.6012 9.7645 10.1833 10.1824C9.76548 10.6002 9.2694 10.9317 8.72344 11.1578C8.17747 11.384 7.59231 11.5004 7.00136 11.5004C6.41041 11.5004 5.82525 11.384 5.27929 11.1578C4.73332 10.9317 4.23725 10.6002 3.81938 10.1824C3.40152 9.7645 3.07005 9.26843 2.8439 8.72246C2.61776 8.1765 2.50136 7.59133 2.50136 7.00039C2.50136 5.80691 2.97547 4.66232 3.81938 3.81841C4.6633 2.97449 5.80789 2.50039 7.00136 2.50039C8.19484 2.50039 9.33943 2.97449 10.1833 3.81841C11.0273 4.66232 11.5014 5.80691 11.5014 7.00039ZM10.6814 11.7404C9.47574 12.6764 7.95873 13.1177 6.43916 12.9745C4.91959 12.8314 3.51171 12.1145 2.50211 10.9698C1.49252 9.8251 0.957113 8.33868 1.0049 6.81314C1.05268 5.28759 1.68006 3.83759 2.75932 2.75834C3.83857 1.67908 5.28856 1.0517 6.81411 1.00392C8.33966 0.956136 9.82608 1.49154 10.9708 2.50114C12.1154 3.51073 12.8323 4.91862 12.9755 6.43819C13.1187 7.95775 12.6773 9.47476 11.7414 10.6804L14.5314 13.4704C14.605 13.539 14.6642 13.6218 14.7051 13.7138C14.7461 13.8058 14.7682 13.9052 14.77 14.0059C14.7717 14.1066 14.7532 14.2066 14.7155 14.3C14.6778 14.3934 14.6216 14.4782 14.5504 14.5494C14.4792 14.6206 14.3943 14.6768 14.301 14.7145C14.2076 14.7522 14.1075 14.7708 14.0068 14.769C13.9061 14.7672 13.8068 14.7452 13.7148 14.7042C13.6228 14.6632 13.54 14.6041 13.4714 14.5304L10.6814 11.7404Z"
                  fill="currentColor"
                />
              </svg>
              <input
                type="text"
                id="filter-text-box"
                placeholder="Search Customer..."
                onInput={onFilterTextBoxChanged}
              />
            </div>
            <button
              className={styles.newButton}
              style={{
                marginLeft: 0,
                padding: "8px 16px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => {
                if (gridRef.current) {
                  gridRef.current.api.applyTransaction({
                    add: [{
                      quotationID: `Q-NEW-${Date.now()}`,
                      customerID: "",
                      customerName: "",
                      status: "draft",
                      // ...add other default fields as needed
                    }],
                    addIndex: 0,
                  });
                }
              }}
            >
              + New
            </button>
          </div>
        </div>
        <div className={`${themeClass} ${styles.grid}`}>
          <AgGridReact
            theme="legacy"
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            rowHeight={35}
            autoSizeStrategy={autoSizeStrategy}
            pagination
            paginationPageSize={10}
            paginationPageSizeSelector={paginationPageSizeSelector}
            masterDetail
            detailCellRendererParams={detailCellRendererParams}
            quickFilterText={quickFilterText}
            detailRowAutoHeight
            allowDragFromColumnsToolPanel={true}
            rowGroupPanelShow="always"
          />
        </div>
      </div>
    </div>
  );
};

