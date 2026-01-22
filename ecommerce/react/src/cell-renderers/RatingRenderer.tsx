import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import styles from "./RatingRenderer.module.css";

export const RatingRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, number>
> = ({ value }) => {
  if (value == null) return null;

  const rating = Number(value);
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className={styles.container}>
      <div className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`${styles.star} ${
              i < fullStars
                ? styles.filled
                : i === fullStars && hasHalf
                  ? styles.half
                  : styles.empty
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className={styles.value}>{rating.toFixed(1)}</span>
    </div>
  );
};
