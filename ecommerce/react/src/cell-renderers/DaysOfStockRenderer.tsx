import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import styles from "./DaysOfStockRenderer.module.css";

interface DaysOfStockValue {
  days: number;
  isDigital: boolean;
}

export const DaysOfStockRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, DaysOfStockValue>
> = ({ value }) => {
  if (!value) return null;

  const { days, isDigital } = value;

  if (isDigital) {
    return (
      <div className={styles.container}>
        <span className={`${styles.badge} ${styles.digital}`}>N/A</span>
      </div>
    );
  }

  let statusClass: string;
  let icon: string;
  let iconClass = styles.icon;

  if (days < 14) {
    statusClass = styles.critical;
    icon = "\u26A0"; // Warning sign
    iconClass = `${styles.icon} ${styles.pulse}`;
  } else if (days < 30) {
    statusClass = styles.warning;
    icon = "\u25CF"; // Filled circle
  } else {
    statusClass = styles.healthy;
    icon = "\u2713"; // Checkmark
  }

  const displayDays = days > 365 ? "365+" : `${days}`;

  return (
    <div className={styles.container}>
      <span className={`${styles.badge} ${statusClass}`}>
        <span className={iconClass}>{icon}</span>
        {displayDays} days
      </span>
    </div>
  );
};
