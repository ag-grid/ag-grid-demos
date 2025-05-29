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

  const onStopSellingClick = useCallback(() => {
    const rowData = node.data;

    const isPaused = rowData.status === "paused";
    const isOutOfStock = rowData.available <= 0;

    // Modify the status property
    rowData.status = !isPaused
      ? "paused"
      : !isOutOfStock
      ? "active"
      : "outOfStock";

    // Refresh the row to reflect the changes
    api.applyTransaction({ update: [rowData] });
  }, [node, api]);

  return (
    <div className={styles.buttonCell}>
      
      <button
        className={`button-secondary ${styles.removeButton}`}
        onClick={onRemoveClick}
      >
        <img src={`/example/inventory/delete.svg`} alt="delete" />
      </button>
      <button
        className={`button-secondary ${styles.buttonStopSelling}`}
        onClick={onStopSellingClick}
      >
        Hold Selling
      </button>
    </div>
  );
};
