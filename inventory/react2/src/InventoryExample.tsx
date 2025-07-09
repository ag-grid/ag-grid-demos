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
import Switch from "@mui/material/Switch"; // If using MUI, or use your preferred toggle

import styles from "./InventoryExample.module.css";
import { getData } from "./data";
import { ActionsCellRenderer } from "./cell-renderers/ActionsCellRenderer";
import { ProductCellRenderer } from "./cell-renderers/ProductCellRenderer";
import { StatusCellRenderer } from "./cell-renderers/StatusCellRenderer";
import { StockCellRenderer } from "./cell/renderers/StockCellRenderer";
import { PriceCellRenderer } from "./cell/renderers/PriceCellRenderer";

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

  paused: "Deactivated",
  active: "Active",
};

const statusFormatter: ValueFormatterFunc = ({ value }) =>
  statuses[(value as string)?.toLowerCase() as keyof typeof statuses] ?? value ?? "";

export const InventoryExample: FunctionComponent<Props> = ({
  gridTheme = "ag-theme-balham",
  isDarkMode,
}) => {
  const gridRef = useRef<AgGridReact>(null);

  // Toggle cell renderer for activate/deactivate
  const ToggleCellRenderer = (props: any) => {
    const isActive = props.data.status === "active";
    return (
      <Switch
        checked={isActive}
        color="success"
        size="small"
        onChange={() => {
          props.api.applyTransaction({
            update: [{ ...props.data, status: isActive ? "inactive" : "active" }],
          });
        }}
        inputProps={{ "aria-label": "Activate/Deactivate User" }}
      />
    );
  };

  // Flat column definitions for user table, with Actions column first
  const [colDefs] = useState<ColDef[]>([


    {
      field: "toggle",
      headerName: "",
      width: 30,
      cellRenderer: ToggleCellRenderer,
      cellStyle: { display: "flex", justifyContent: "center" },
      filter: false,
      sortable: false,
      pinned: "left",
    },
    { field: "userID", headerName: "User ID", width: 100, filter: true },
    { field: "userName", headerName: "User Name", width: 100, filter: true },
    { field: "email", headerName: "Email", width: 100, filter: true },
    { field: "lastLoggedIn", headerName: "Last Logged In", width: 100 },
    {
      field: "edit",
      minWidth: 20,
      headerName: "Edit",
      width: 20,
      headerClass: 'iconHeader',
      cellRenderer: (props: any) => (
        <button
          style={{
            padding: 0,
            minWidth: 20,
            minHeight: 20,
            background: "transparent",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}
          onClick={() => {
            alert(`Edit user: ${props.data.userName}`);
          }}
          title="Edit"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.146 2.854a1.207 1.207 0 0 1 1.707 1.707l-7.5 7.5a1 1 0 0 1-.414.242l-3 1a.5.5 0 0 1-.633-.633l1-3a1 1 0 0 1 .242-.414l7.5-7.5ZM13.207 1.793a2.207 2.207 0 0 0-3.121 0l-7.5 7.5A2 2 0 0 0 2.293 12.5l-1 3A1.5 1.5 0 0 0 3 15.707l3-1a2 2 0 0 0 .707-.414l7.5-7.5a2.207 2.207 0 0 0 0-3.121Z"
              fill="#C9A100"
            />
          </svg>
        </button>
      ),
      cellStyle: { display: "flex", justifyContent: "center" },
      filter: false,
      sortable: false,
      pinned: "left",
    },
    {
      field: "delete",
      minWidth: 20,
      headerName: "Delete",
      width: 20,
      headerClass: 'iconHeader',
      cellRenderer: (props: any) => (
        <button
          style={{
            padding: 0,
            minWidth: 20,
            minHeight: 20,
            background: "transparent",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: "pointer",
            display: "flex",
          }}
          onClick={() => {
            if (window.confirm(`Delete user: ${props.data.userName}?`)) {
              props.api.applyTransaction({ remove: [props.data] });
            }
          }}
          title="Delete"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M6 2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V3H13C13.2761 3 13.5 3.22386 13.5 3.5C13.5 3.77614 13.2761 4 13 4H3C2.72386 4 2.5 3.77614 2.5 3.5C2.5 3.22386 2.72386 3 3 3H6V2.5ZM4 5V12.5C4 13.3284 4.67157 14 5.5 14H10.5C11.3284 14 12 13.3284 12 12.5V5H4ZM6 6C6.27614 6 6.5 6.22386 6.5 6.5V11.5C6.5 11.7761 6.27614 12 6 12C5.72386 12 5.5 11.7761 5.5 11.5V6.5C5.5 6.22386 5.72386 6 6 6ZM8 6C8.27614 6 8.5 6.22386 8.5 6.5V11.5C8.5 11.7761 8.27614 12 8 12C7.72386 12 7.5 11.7761 7.5 11.5V6.5C7.5 6.22386 7.72386 6 8 6ZM10 6C10.2761 6 10.5 6.22386 10.5 6.5V11.5C10.5 11.7761 10.2761 12 10 12C9.72386 12 9.5 11.7761 9.5 11.5V6.5C9.5 6.22386 9.72386 6 10 6Z"
              fill="#e53935"
            />
          </svg>
        </button>
      ),
      cellStyle: { display: "flex", justifyContent: "center" },
      filter: false,
      sortable: false,
      pinned: "left",
    },
    {
      field: "resetPassword",
      minWidth: 20,
      headerName: "Reset Password",
      width: 20,
      headerClass: 'iconHeader',
      cellRenderer: (props: any) => (
        <button
          style={{
            padding: 0,
            minWidth: 20,
            minHeight: 20,
            background: "transparent",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
            cursor: props.data.status === "active" ? "pointer" : "not-allowed",
            opacity: props.data.status === "active" ? 1 : 0.3,
            display: "flex",
          }}
          onClick={() => {
            if (props.data.status === "active") {
              alert(`Reset password for user: ${props.data.userName}`);
            }
          }}
          title="Reset Password"
          disabled={props.data.status !== "active"}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="8" cy="12" r="2.5" stroke="#1976d2" strokeWidth="1.5" />
            <rect x="10" y="11.25" width="6" height="2" rx="1" fill="#1976d2" />
            <rect x="15" y="10.5" width="1.2" height="4" rx="0.6" fill="#1976d2" />
          </svg>
        </button>
      ),
      cellStyle: { display: "flex", justifyContent: "center" },
      filter: false,
      sortable: false,
      pinned: "left",
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
        },
        columnDefs: [
          { field: "col1", filter: true, headerName: "Col1" },
          { field: "col2", filter: true, headerName: "Col2" },
          { field: "col3", filter: true, headerName: "Col3" },
          { field: "col4", filter: true, headerName: "Col4" },
        ],
        groupDefaultExpanded: 0,
      },
      getDetailRowData: ({ successCallback, data }: GetDetailRowDataParams) => {
        // Recursively add a 'path' property to each node
        function addPath(nodes: any[], parentPath: string[] = []) {
          return nodes.map((node) => {
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
  const handleTabClick = useCallback(
    (status: string) => {
      setActiveTab(status);
      gridRef
        .current!.api.setColumnFilterModel(
          "status",
          status === "all" ? null : { values: [status] }
        )
        .then(() => gridRef.current!.api.onFilterChanged());
    },
    []
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} style={{ width: "75%", margin: "0 auto" }}>
        <div className={styles.exampleHeader}>
          <div className={styles.tabs}>
            {Object.entries(statuses).map(([key, displayValue]) => {
              let borderColor = "transparent";
              if (key === "active") borderColor = "#43a047";
              else if (key === "paused") borderColor = "#BFCDDB";
              else if (key.toLocaleLowerCase() === "draft") borderColor = "#EF4444";
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
                width="18"
                height="18"
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
                    add: [
                      {
                        quotationID: `Q-NEW-${Date.now()}`,
                        customerID: "",
                        customerName: "",
                        status: "draft",
                      },
                    ],
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
            headerHeight={55}
            paginationPageSize={10}
            paginationPageSizeSelector={paginationPageSizeSelector}
            masterDetail
            detailCellRendererParams={detailCellRendererParams}
            quickFilterText={quickFilterText}
            detailRowAutoHeight
            allowDragFromColumnsToolPanel={true}
            domLayout="autoHeight" // Makes grid height fit rows
            onGridReady={(params) => params.api.sizeColumnsToFit()} // Fit columns to grid width
          />
        </div>
      </div>
    </div>
  );
};

