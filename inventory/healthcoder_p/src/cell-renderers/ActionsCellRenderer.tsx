import type { CustomCellRendererProps } from "ag-grid-react";
import { type FunctionComponent, useCallback } from "react";

import styles from "./ActionsCellRenderer.module.css";

export const ActionsCellRenderer: FunctionComponent<
  CustomCellRendererProps
> = ({ api, node }) => {
  const onRemoveClick = useCallback(() => {
    const rowData = node.data;
    api.applyTransaction({ remove: [rowData] });
  }, [node, api]);

  const onViewMoreClick = useCallback(() => {
    alert("View more details...");
  }, []);

  const onManageInstitutionsClick = useCallback(() => {
    alert("Manage user institutions (companies):\n\n- Microsoft\n- Google\n- Amazon\n- Apple");
  }, []);

  const onManageGroupsClick = useCallback(() => {
    alert("Manage user groups...");
  }, []);

  const { data } = node;

  return (
    <div>
      <div className={styles.buttonCell} style={{ display: "flex", alignItems: "left" }}>
        {/* Edit */}
        {data && data.status === "active" && (
          <span
            style={{
              marginLeft: 0,
              display: "inline-block",
              width: 5,
              height: 25,

              background: "#009900",


            }}
            title="Active"
          />
        )}
        {data && data.status === "paused" && (
          <span
            style={{
              marginLeft: 0,
              display: "inline-block",
              width: 5,
              height: 25,

              background: "#BFCDDB",


            }}
            title="Active"
          />
        )}
        {data && data.status === "draft" && (
          <span
            style={{
              marginLeft: 0,
              display: "inline-block",
              width: 5,
              height: 25,

              background: "#EF4444",


            }}
            title="Active"
          />
        )}



      </div>
    </div >
  );
};
