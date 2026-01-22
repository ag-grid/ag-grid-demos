import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import styles from "./MomentumRenderer.module.css";

export const MomentumRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, number>
> = ({ value }) => {
  if (value === null || value === undefined) return null;

  const pct = value;
  let statusClass: string;
  let arrow: string;
  let label: string;

  if (pct > 20) {
    statusClass = styles.strongGrowth;
    arrow = "↑";
    label = "Strong";
  } else if (pct > 5) {
    statusClass = styles.moderateGrowth;
    arrow = "↗";
    label = "";
  } else if (pct >= -5) {
    statusClass = styles.flat;
    arrow = "→";
    label = "Flat";
  } else if (pct >= -20) {
    statusClass = styles.moderateDecline;
    arrow = "↘";
    label = "";
  } else {
    statusClass = styles.strongDecline;
    arrow = "↓";
    label = "Alert";
  }

  const displayPct = pct > 0 ? `+${pct.toFixed(0)}%` : `${pct.toFixed(0)}%`;

  return (
    <div className={styles.container}>
      <span className={`${styles.badge} ${statusClass}`}>
        <span className={styles.arrow}>{arrow}</span>
        <span className={styles.value}>{displayPct}</span>
        {label && <span className={styles.label}>{label}</span>}
      </span>
    </div>
  );
};
