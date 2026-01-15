import { CSSProperties } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import styles from "./EcommerceExample.module.css";

export default function EcommerceExample() {
  const gridStyle: CSSProperties = {
    height: "100vh",
    width: "100%",
  };

  return (
    <div style={gridStyle} className={`${styles.container} ag-theme-quartz`}>
      <h1>Ecommerce Demo - Coming Soon</h1>
      <p>AG Grid Ecommerce example will be implemented here.</p>
    </div>
  );
}
