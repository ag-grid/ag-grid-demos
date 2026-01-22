import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import styles from "./MarginBarRenderer.module.css";

export const MarginBarRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, number>
> = ({ value }) => {
  if (value == null) return null;

  const margin = Number(value);
  const clampedMargin = Math.min(100, Math.max(0, margin));

  // Determine color based on margin level
  const getBarClass = () => {
    if (margin >= 40) return styles.barHigh;
    if (margin >= 20) return styles.barMedium;
    return styles.barLow;
  };

  return (
    <div className={styles.container}>
      <div className={styles.barWrapper}>
        <div
          className={`${styles.bar} ${getBarClass()}`}
          style={{ width: `${clampedMargin}%` }}
        />
      </div>
      <span className={styles.value}>{margin.toFixed(1)}%</span>
    </div>
  );
};
