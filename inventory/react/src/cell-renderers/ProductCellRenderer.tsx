import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import styles from "./ProductCellRenderer.module.css";

export const ProductCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value, data: { image, category } }) => (
  <div className={styles.productCell}>
    <div className={styles.image}>
      <img src={`/example/inventory/${image}.webp`} alt={image} />
    </div>
    <div>
      <div>{value}</div>
      <div className={styles.stockCell}>{category}</div>
    </div>
  </div>
);
