import type { CustomCellRendererProps } from "@ag-grid-community/react";
import { type FunctionComponent } from "react";

export const TickerCellRenderer: FunctionComponent<CustomCellRendererProps> = ({
  data,
}) => {
  return (
    data && (
      <div>
        <img
          src={`/example/finance/logos/${data.ticker}.png`}
          style={{
            width: "20px",
            height: "20px",
            marginRight: "5px",
            borderRadius: "32px",
          }}
        />
        <b className="custom-ticker">{data.ticker}</b>
        <span className="ticker-name"> {data.name}</span>
      </div>
    )
  );
};
