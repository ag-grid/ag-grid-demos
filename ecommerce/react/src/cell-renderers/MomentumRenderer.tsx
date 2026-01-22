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

  if (pct > 20) {
    statusClass = styles.strongGrowth;
    arrow = "\u25B2"; // Up triangle
  } else if (pct > 5) {
    statusClass = styles.moderateGrowth;
    arrow = "\u25B2";
  } else if (pct >= -5) {
    statusClass = styles.flat;
    arrow = "\u2192"; // Right arrow
  } else if (pct >= -20) {
    statusClass = styles.moderateDecline;
    arrow = "\u25BC"; // Down triangle
  } else {
    statusClass = styles.strongDecline;
    arrow = "\u25BC";
  }

  const displayPct = pct > 0 ? `+${pct.toFixed(0)}%` : `${pct.toFixed(0)}%`;

  return (
    <div className={styles.container}>
      <span className={`${styles.badge} ${statusClass}`}>
        <span className={styles.arrow}>{arrow}</span>
        {displayPct}
      </span>
    </div>
  );
};
