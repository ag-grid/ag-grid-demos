import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent } from "react";

import styles from "./ProductImageCellRenderer.module.css";

const getIconPath = (product: string, sku: string): string => {
  // Use hash of product name to consistently pick an icon
  const hash = (str: string) => {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h) + str.charCodeAt(i);
      h = h & h; // Convert to 32bit integer
    }
    return Math.abs(h);
  };

  const icons = [
    "music.svg",
    "book.svg",
    "camera.svg",
    "phone.svg",
    "package.svg",
    "product.svg",
  ];

  const index = hash(product + sku) % icons.length;
  return `/example/ecommerce/icons/${icons[index]}`;
};

export const ProductImageCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ value, data: { product, sku } }) => (
  <div className={styles.imageCell}>
    <div className={styles.image}>
      <img
        src={getIconPath(product, sku)}
        alt={product}
        title={product}
      />
    </div>
  </div>
);
