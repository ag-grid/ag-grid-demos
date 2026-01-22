import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import styles from "./PriceChangeRenderer.module.css";

export const PriceChangeRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, number>
> = ({ value }) => {
  if (value == null) return null;

  const change = Number(value);
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const statusClass = isPositive
    ? styles.positive
    : isNegative
      ? styles.negative
      : styles.neutral;

  const arrow = isPositive ? "↑" : isNegative ? "↓" : "—";
  const formattedValue = isPositive
    ? `+$${change.toFixed(0)}`
    : isNegative
      ? `-$${Math.abs(change).toFixed(0)}`
      : "$0";

  return (
    <div className={styles.container}>
      <span className={`${styles.badge} ${statusClass}`}>
        <span className={styles.arrow}>{arrow}</span>
        <span className={styles.value}>{formattedValue}</span>
      </span>
    </div>
  );
};
