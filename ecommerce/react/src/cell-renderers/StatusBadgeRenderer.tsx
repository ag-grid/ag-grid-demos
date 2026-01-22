import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";
import styles from "./StatusBadgeRenderer.module.css";

export const StatusBadgeRenderer: FunctionComponent<
  CustomCellRendererProps<unknown, string>
> = ({ value }) => {
  if (!value) return null;

  const status = value.toLowerCase();
  const label = value.charAt(0).toUpperCase() + value.slice(1);

  const statusClass =
    {
      active: styles.active,
      discontinued: styles.discontinued,
      inactive: styles.inactive,
    }[status] || styles.default;

  return (
    <div className={styles.container}>
      <span className={`${styles.badge} ${statusClass}`}>
        <span className={styles.dot} />
        {label}
      </span>
    </div>
  );
};
