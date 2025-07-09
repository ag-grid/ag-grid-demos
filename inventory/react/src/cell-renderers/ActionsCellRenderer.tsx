import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent, useCallback } from "react";

import styles from "./ActionsCellRenderer.module.css";

export const ActionsCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ api, node }) => {
  const onRemoveClick = useCallback(() => {
    const rowData = node.data;
    api.applyTransaction({ remove: [rowData] });
  }, [node, api]);

  const onViewMoreClick = useCallback(() => {
    // Implement your "View more" logic here
    alert("View more details...");
  }, []);

  const onDuplicateClick = useCallback(() => {
    const rowData = { ...node.data, quotationID: `${node.data.quotationID}-copy` };
    api.applyTransaction({ add: [rowData] });
  }, [node, api]);

  const { data } = node;

  return (
    <div>
      <div>

      </div>
      <div className={styles.buttonCell} style={{ display: "flex", alignItems: "left" }}>
        {data && data.status === "active" && (
          <span
            style={{
              marginLeft: 0,
              display: "inline-block",
              width: 5,
              height: 25,

              background: "#009900",


            }}
            title="Active"
          />
        )}
        {data && data.status === "paused" && (
          <span
            style={{
              marginLeft: 0,
              display: "inline-block",
              width: 5,
              height: 25,

              background: "#ff9900",


            }}
            title="Active"
          />
        )}
        {data && data.status === "draft" && (
          <span
            style={{
              marginLeft: 0,
              display: "inline-block",
              width: 5,
              height: 25,

              background: "#737373",


            }}
            title="Active"
          />
        )}

        <button
          className={`button-secondary ${styles.buttonViewMore}`}
          style={{
            padding: 4,
            minWidth: 24,
            minHeight: 24,
            marginLeft: 4,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onViewMoreClick}
          title="Edit"
        >
          {/* Edit (pencil) icon in dark yellow */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
            <path
              d="M12.146 2.854a1.207 1.207 0 0 1 1.707 1.707l-7.5 7.5a1 1 0 0 1-.414.242l-3 1a.5.5 0 0 1-.633-.633l1-3a1 1 0 0 1 .242-.414l7.5-7.5ZM13.207 1.793a2.207 2.207 0 0 0-3.121 0l-7.5 7.5A2 2 0 0 0 2.293 12.5l-1 3A1.5 1.5 0 0 0 3 15.707l3-1a2 2 0 0 0 .707-.414l7.5-7.5a2.207 2.207 0 0 0 0-3.121Z"
              fill="#C9A100"
            />
          </svg>
        </button>
        <button
          className={`button-secondary ${styles.buttonViewMore}`}
          style={{
            padding: 4,
            minWidth: 24,
            minHeight: 24,
            marginLeft: 4,
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={onDuplicateClick}
          title="Duplicate"
        >
          {/* Duplicate icon (two overlapping squares) */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
            <rect x="4" y="4" width="8" height="8" rx="2" fill="#1976d2" fillOpacity="0.5" />
            <rect x="6" y="6" width="8" height="8" rx="2" fill="#1976d2" />
          </svg>
        </button>

        {data && (data.status === "draft" || data.status === "paused") && (
          <button
            className={`button-secondary ${styles.buttonViewMore}`}
            style={{
              padding: 4,
              minWidth: 24,
              minHeight: 24,
              marginLeft: 4,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onRemoveClick}
            title="Delete"
          >
            {/* Red trash bin SVG icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
              <path
                d="M6 2.5C6 2.22386 6.22386 2 6.5 2H9.5C9.77614 2 10 2.22386 10 2.5V3H13C13.2761 3 13.5 3.22386 13.5 3.5C13.5 3.77614 13.2761 4 13 4H3C2.72386 4 2.5 3.77614 2.5 3.5C2.5 3.22386 2.72386 3 3 3H6V2.5ZM4 5V12.5C4 13.3284 4.67157 14 5.5 14H10.5C11.3284 14 12 13.3284 12 12.5V5H4ZM6 6C6.27614 6 6.5 6.22386 6.5 6.5V11.5C6.5 11.7761 6.27614 12 6 12C5.72386 12 5.5 11.7761 5.5 11.5V6.5C5.5 6.22386 5.72386 6 6 6ZM8 6C8.27614 6 8.5 6.22386 8.5 6.5V11.5C8.5 11.7761 8.27614 12 8 12C7.72386 12 7.5 11.7761 7.5 11.5V6.5C7.5 6.22386 7.72386 6 8 6ZM10 6C10.2761 6 10.5 6.22386 10.5 6.5V11.5C10.5 11.7761 10.2761 12 10 12C9.72386 12 9.5 11.7761 9.5 11.5V6.5C9.5 6.22386 9.72386 6 10 6Z"
                fill="#e53935"
              />
            </svg>
          </button>
        )}

        {data && data.status === "paused" && (
          <button
            className={`button-secondary ${styles.buttonApprove}`}
            style={{
              padding: 4,
              minWidth: 24,
              minHeight: 24,
              marginLeft: 4,
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#388e3c",
            }}
            onClick={() => {
              // Example approve logic, replace with your own
              api.applyTransaction({ update: [{ ...data, status: "active" }] });
            }}
            title="Approve"
          >
            {/* Green checkmark SVG icon */}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ display: "block" }}>
              <path
                d="M6.00016 11.2002L3.30016 8.50016C3.11016 8.31016 2.82016 8.31016 2.63016 8.50016C2.44016 8.69016 2.44016 8.98016 2.63016 9.17016L5.65016 12.1902C5.84016 12.3802 6.13016 12.3802 6.32016 12.1902L13.3702 5.14016C13.5602 4.95016 13.5602 4.66016 13.3702 4.47016C13.1802 4.28016 12.8902 4.28016 12.7002 4.47016L6.00016 11.2002Z"
                fill="#388e3c"
              />
            </svg>
          </button>
        )}



      </div>
    </div>
  );
};
