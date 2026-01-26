import type { ICellRendererParams } from "ag-grid-community";

import styles from "../PerformanceExample.module.css";
import { COUNTRY_CODES } from "../data";
import starIcon from "../assets/star.svg";

interface RatingRendererParams extends ICellRendererParams {
  isFilterRenderer?: boolean;
}

export const CountryCellRenderer = ({ value }: ICellRendererParams) => {
  if (value === undefined) {
    return (
      <span style={{ cursor: "default", overflow: "hidden", textOverflow: "ellipsis" }} />
    );
  }
  if (value == null || value === "" || value === "(Select All)") {
    return (
      <span style={{ cursor: "default", overflow: "hidden", textOverflow: "ellipsis" }}>
        {value || ""}
      </span>
    );
  }

  return (
    <span style={{ cursor: "default", overflow: "hidden", textOverflow: "ellipsis" }}>
      <img
        alt={`${value} flag`}
        width={15}
        height={10}
        src={`https://flags.fmcdn.net/data/flags/mini/${COUNTRY_CODES[value]}.png`}
      />
      {` ${value}`}
    </span>
  );
};

export const RatingRenderer = (params: RatingRendererParams) => {
  const { value } = params;
  if (value === "(Select All)") {
    return value;
  }
  if (params.isFilterRenderer && value === 0) {
    return "(No stars)";
  }

  const numericValue = typeof value === "string" ? parseInt(value, 10) : (value as number);

  return (
    <span>
      {[...Array(5)].map((_, i) =>
        numericValue > i ? (
          <img
            className={styles.starIcon}
            key={i}
            src={starIcon}
            alt={`${value} stars`}
            width={12}
            height={12}
          />
        ) : null
      )}
    </span>
  );
};
