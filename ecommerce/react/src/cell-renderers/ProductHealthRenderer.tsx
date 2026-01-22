import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import styles from "./ProductHealthRenderer.module.css";

interface HealthScoreValue {
  score: number;
  grade: string;
  breakdown: {
    margin: number;
    velocity: number;
    rating: number;
    stock: number;
  };
}

export const ProductHealthRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, HealthScoreValue>
> = ({ value }) => {
  if (!value) return null;

  const { grade, breakdown } = value;

  const gradeClass =
    {
      A: styles.gradeA,
      B: styles.gradeB,
      C: styles.gradeC,
      D: styles.gradeD,
      F: styles.gradeF,
    }[grade] || styles.gradeC;

  const tooltipText = `Margin: ${breakdown.margin.toFixed(0)}/25\nVelocity: ${breakdown.velocity.toFixed(0)}/25\nRating: ${breakdown.rating.toFixed(0)}/25\nStock: ${breakdown.stock.toFixed(0)}/25`;

  return (
    <div className={styles.container}>
      <span
        className={`${styles.badge} ${gradeClass} ${styles.tooltip}`}
        data-tooltip={tooltipText}
      >
        {grade}
      </span>
    </div>
  );
};
