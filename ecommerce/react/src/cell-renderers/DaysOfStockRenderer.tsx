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
        <span className={`${styles.badge} ${styles.digital}`}>
          <span className={styles.icon}>☁</span>
          Digital
        </span>
      </div>
    );
  }

  let statusClass: string;
  let icon: string;
  let iconClass = styles.icon;
  let progressPercent: number;

  // Calculate progress based on 60-day threshold
  const maxDays = 60;
  progressPercent = Math.min(100, (days / maxDays) * 100);

  if (days < 14) {
    statusClass = styles.critical;
    icon = "⚠";
    iconClass = `${styles.icon} ${styles.pulse}`;
  } else if (days < 30) {
    statusClass = styles.warning;
    icon = "◐";
  } else {
    statusClass = styles.healthy;
    icon = "✓";
  }

  const displayDays = days > 365 ? "365+" : `${days}`;

  return (
    <div className={styles.container}>
      <div className={styles.badgeWrapper}>
        <span className={`${styles.badge} ${statusClass}`}>
          <span className={iconClass}>{icon}</span>
          <span className={styles.text}>{displayDays}d</span>
        </span>
        <div className={styles.progressWrapper}>
          <div
            className={`${styles.progressBar} ${statusClass}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
