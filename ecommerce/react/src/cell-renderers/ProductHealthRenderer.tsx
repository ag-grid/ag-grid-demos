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

const gradeColors: Record<string, string> = {
  A: "#22c55e",
  B: "#3b82f6",
  C: "#eab308",
  D: "#f97316",
  F: "#ef4444",
};

export const ProductHealthRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, HealthScoreValue>
> = ({ value }) => {
  if (!value) return null;

  const { score, grade, breakdown } = value;

  const gradeClass =
    {
      A: styles.gradeA,
      B: styles.gradeB,
      C: styles.gradeC,
      D: styles.gradeD,
      F: styles.gradeF,
    }[grade] || styles.gradeC;

  const tooltipText = `Score: ${score.toFixed(0)}/100\nMargin: ${breakdown.margin.toFixed(0)}/25\nVelocity: ${breakdown.velocity.toFixed(0)}/25\nRating: ${breakdown.rating.toFixed(0)}/25\nStock: ${breakdown.stock.toFixed(0)}/25`;

  // Calculate ring progress (score is 0-100)
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const strokeColor = gradeColors[grade] || "#eab308";

  return (
    <div className={styles.container}>
      <div className={styles.badgeWrapper}>
        <svg className={styles.ring} viewBox="0 0 36 36">
          <circle
            className={styles.ringCircle}
            cx="18"
            cy="18"
            r={radius}
          />
          <circle
            className={styles.ringProgress}
            cx="18"
            cy="18"
            r={radius}
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
          />
        </svg>
        <span
          className={`${styles.badge} ${gradeClass} ${styles.tooltip}`}
          data-tooltip={tooltipText}
        >
          {grade}
        </span>
      </div>
    </div>
  );
};
