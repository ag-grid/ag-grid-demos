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

  // Status icon SVGs for header
  const statusHeaderIcons = {
    "Condition Not Met": (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#bdbdbd" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff">!</text>
      </svg>
    ),
    "Condition Met No Change": (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#1976d2" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff">i</text>
      </svg>
    ),
    "Condition Met Made Changes": (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#43a047" />
        <polyline points="8,13 11,16 16,9" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
    "Error": (
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#e53935" />
        <line x1="8" y1="8" x2="16" y2="16" stroke="#fff" strokeWidth="2" />
        <line x1="16" y1="8" x2="8" y2="16" stroke="#fff" strokeWidth="2" />
      </svg>
    ),
  };

  // Header icon components
  const ConditionNotMetHeader = () => (
    <span title="Condition Not Met">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#bdbdbd" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff" dominantBaseline="middle">!</text>
      </svg>
    </span>
  );
  const ConditionMetNoChangeHeader = () => (
    <span title="Condition Met No Change">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#1976d2" />
        <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff" dominantBaseline="middle">i</text>
      </svg>
    </span>
  );
  const ConditionMetMadeChangesHeader = () => (
    <span title="Condition Met Made Changes">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#43a047" />
        <polyline points="8,13 11,16 16,9" fill="none" stroke="#fff" strokeWidth="2" />
      </svg>
    </span>
  );
  const ErrorHeader = () => (
    <span title="Error">
      <svg width="18" height="18" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#e53935" />
        <line x1="8" y1="8" x2="16" y2="16" stroke="#fff" strokeWidth="2" />
        <line x1="16" y1="8" x2="8" y2="16" stroke="#fff" strokeWidth="2" />
      </svg>
    </span>
  );

  const [colDefs] = useState<ColDef[]>([
    {
      headerName: "",
      field: "group",
      width: 50,
      cellRenderer: "agGroupCellRenderer",
      filter: false,
      sortable: false,
      pinned: "left",
    },
    {
      headerName: "",
      field: "countError",
      width: 60,
      filter: false,
      sortable: false,
      pinned: "left",
      cellRenderer: (params: any) => {
        const count = params.data?.automations?.filter((a: any) => a.status === "Error").length || 0;
        return count === 0 ? "" : count;
      },
      headerComponent: ErrorHeader,
    },
    {
      headerName: "",
      field: "countConditionNotMet",
      width: 60,
      filter: false,
      sortable: false,
      pinned: "left",
      cellRenderer: (params: any) => {
        const count = params.data?.automations?.filter((a: any) => a.status === "Condition Not Met").length || 0;
        return count === 0 ? "" : count;
      },
      headerComponent: ConditionNotMetHeader,
    },
    {
      headerName: "",
      field: "countConditionMetNoChange",
      width: 60,
      filter: false,
      sortable: false,
      pinned: "left",
      cellRenderer: (params: any) => {
        const count = params.data?.automations?.filter((a: any) => a.status === "Condition Met No Change").length || 0;
        return count === 0 ? "" : count;
      },
      headerComponent: ConditionMetNoChangeHeader,
    },
    {
      headerName: "",
      field: "countConditionMetMadeChanges",
      width: 60,
      filter: false,
      sortable: false,
      pinned: "left",
      cellRenderer: (params: any) => {
        const count = params.data?.automations?.filter((a: any) => a.status === "Condition Met Made Changes").length || 0;
        return count === 0 ? "" : count;
      },
      headerComponent: ConditionMetMadeChangesHeader,
    },
    { field: "appointmentId", headerName: "Appointment Id", width: 140, filter: true },
    { field: "appointmentDate", headerName: "Appointment Date", width: 140, filter: true },
    { field: "patientId", headerName: "Patient ID", width: 120, filter: true },
    { field: "lastName", headerName: "Last Name", width: 140, filter: true },
    { field: "firstName", headerName: "First Name", width: 140, filter: true },
    { field: "dob", headerName: "DOB", width: 120, filter: true },
  ]);

  // Add child table data to each row
  const [rowData] = useState([
    {
      appointmentId: "A001",
      appointmentDate: "2025-06-01",
      patientId: "P1001",
      lastName: "Smith",
      firstName: "John",
      dob: "1990-01-01",
      automations: [
        { automationId: "AUTO-001", status: "Condition Not Met", notification: "Email sent" },
        { automationId: "AUTO-002", status: "Condition Met No Change", notification: "25 already exist" },
        { automationId: "AUTO-003", status: "Condition Met Made Changes", notification: "added the number 25" },
        { automationId: "AUTO-004", status: "Error", notification: "Push sent" },
        { automationId: "AUTO-005", status: "Condition Not Met", notification: "No notification" },
      ],
    },
    {
      appointmentId: "A002",
      appointmentDate: "2025-06-02",
      patientId: "P1002",
      lastName: "Johnson",
      firstName: "Emily",
      dob: "1988-02-14",
      automations: [
        { automationId: "AUTO-006", status: "Condition Met No Change", notification: "26 already exist" },
        { automationId: "AUTO-007", status: "Condition Met Made Changes", notification: "added the number 26" },
        { automationId: "AUTO-008", status: "Condition Not Met", notification: "" },
        { automationId: "AUTO-009", status: "Condition Not Met", notification: "" },
        { automationId: "AUTO-010", status: "Condition Met No Change", notification: "26 already exist" },
      ],
    },
    {
      appointmentId: "A003",
      appointmentDate: "2025-06-03",
      patientId: "P1003",
      lastName: "Williams",
      firstName: "Michael",
      dob: "1992-03-22",
      automations: [
        { automationId: "AUTO-011", status: "Condition Met Made Changes", notification: "Email sent" },
        { automationId: "AUTO-012", status: "Error", notification: "No notification" },
        { automationId: "AUTO-013", status: "Condition Met No Change", notification: "27 already exist" },
        { automationId: "AUTO-014", status: "Condition Met No Change", notification: "27 already exist" },
        { automationId: "AUTO-015", status: "Condition Met Made Changes", notification: "added the number 27" },
      ],
    },
    {
      appointmentId: "A004",
      appointmentDate: "2025-06-04",
      patientId: "P1004",
      lastName: "Brown",
      firstName: "Sarah",
      dob: "1985-04-10",
      automations: [
        { automationId: "AUTO-016", status: "Error", notification: "Email sent" },
        { automationId: "AUTO-017", status: "Condition Not Met", notification: "No notification" },
        { automationId: "AUTO-018", status: "Condition Met No Change", notification: "28 already exist" },
        { automationId: "AUTO-019", status: "Condition Met Made Changes", notification: "added the number 28" },
        { automationId: "AUTO-020", status: "Condition Not Met", notification: "No notification" },
      ],
    },
    {
      appointmentId: "A005",
      appointmentDate: "2025-06-05",
      patientId: "P1005",
      lastName: "Jones",
      firstName: "David",
      dob: "1991-05-30",
      automations: [
        { automationId: "AUTO-021", status: "Condition Not Met", notification: "Email sent" },
        { automationId: "AUTO-022", status: "Condition Met No Change", notification: "28 already exist" },
        { automationId: "AUTO-023", status: "Condition Met Made Changes", notification: "added the number 25" },
        { automationId: "AUTO-024", status: "Error", notification: "Push sent" },
        { automationId: "AUTO-025", status: "Condition Not Met", notification: "No notification" },
      ],
    },
  ]);

  // Child table column definitions
  const detailColDefs = [
    { field: "automationId", headerName: "AutomationID", width: 140 },
    {
      field: "status",
      headerName: "Status, e.g. Condition Not Met, Condition Met No Change, Condition Met Made Changes, Error",
      width: 320,
      cellRenderer: (params: any) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          {statusIcon(params.value)}
          {params.value}
        </span>
      ),
    },
    { field: "notification", headerName: "Notification", width: 180 },
  ]; 

  // Status icon mapping
  const statusIcon = (status: string) => {
    switch (status) {
      case "Condition Not Met":
        // Gray warning icon
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
            <circle cx="12" cy="12" r="10" fill="#bdbdbd" />
            <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff">!</text>
          </svg>
        );
      case "Condition Met No Change":
        // Blue info icon
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
            <circle cx="12" cy="12" r="10" fill="#1976d2" />
            <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#fff">i</text>
          </svg>
        );
      case "Condition Met Made Changes":
        // Green check icon
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
            <circle cx="12" cy="12" r="10" fill="#43a047" />
            <polyline points="8,13 11,16 16,9" fill="none" stroke="#fff" strokeWidth="2" />
          </svg>
        );
      case "Error":
        // Red error icon
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: 6 }}>
            <circle cx="12" cy="12" r="10" fill="#e53935" />
            <line x1="8" y1="8" x2="16" y2="16" stroke="#fff" strokeWidth="2" />
            <line x1="16" y1="8" x2="8" y2="16" stroke="#fff" strokeWidth="2" />
          </svg>
        );
      default:
        return null;
    }
  };

  // AG Grid Master/Detail config
  const detailCellRendererParams = useMemo(
    () => ({
      detailGridOptions: {
        columnDefs: detailColDefs,
        defaultColDef: { flex: 1, minWidth: 100, resizable: true },
      },
      getDetailRowData: (params: any) => {
        params.successCallback(params.data.automations || []);
      },
    }),
    []
  );

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

  const onGridReady = useCallback((params: any) => {
    params.api.sizeColumnsToFit();
    // Select first two rows only
    params.api.forEachNode((node: any) => {
      // if (node.rowIndex === 0 || node.rowIndex === 1) {
      //   node.setSelected(true);
      // } else {
      //   node.setSelected(false);
      // }
    });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    const selectedData = gridRef.current!.api.getSelectedRows();
    gridRef.current!.api.applyTransaction({
      remove: selectedData,
    });
  }, []);

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
        <div style={{ margin: "16px 0" }}>
          <button
            style={{
              margin: "8px 0",
              padding: "6px 16px",
              background: "#e53935",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onClick={handleDeleteSelected}
          >
            Delete Selected
          </button>
        </div>
        <div className={`${themeClass} ${styles.grid}`}>
          <AgGridReact
            theme={gridTheme}
            ref={gridRef}
            columnDefs={colDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            rowSelection="multiple"
            onGridReady={onGridReady}
            getRowId={params => params.data.id}
            pagination
            headerHeight={30}
            paginationPageSize={10}
            paginationPageSizeSelector={paginationPageSizeSelector}
            masterDetail
            detailCellRendererParams={detailCellRendererParams}
            quickFilterText={quickFilterText}
            detailRowAutoHeight
            allowDragFromColumnsToolPanel={true}
            domLayout="autoHeight" // Makes grid height fit rows
          // ...other grid props...
          />
        </div>
      </div>
    </div>
  );
};

