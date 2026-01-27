import type { ICellRendererParams } from "ag-grid-community";

import { COUNTRY_CODES } from "../data";
import starIcon from "../assets/star.svg";

interface RatingRendererParams extends ICellRendererParams {
  isFilterRenderer?: boolean;
}

const createEllipsisSpan = (text = "") => {
  const span = document.createElement("span");
  span.style.cursor = "default";
  span.style.overflow = "hidden";
  span.style.textOverflow = "ellipsis";
  span.textContent = text;
  return span;
};

export const CountryCellRenderer = ({ value }: ICellRendererParams) => {
  if (value === undefined) {
    return createEllipsisSpan();
  }
  if (value == null || value === "" || value === "(Select All)") {
    return createEllipsisSpan(value || "");
  }

  const span = createEllipsisSpan();
  const img = document.createElement("img");
  img.alt = `${value} flag`;
  img.width = 15;
  img.height = 10;
  img.src = `https://flags.fmcdn.net/data/flags/mini/${COUNTRY_CODES[value]}.png`;
  span.append(img, document.createTextNode(` ${value}`));
  return span;
};

export const RatingRenderer = (params: RatingRendererParams) => {
  const { value } = params;
  if (value === "(Select All)") {
    return createEllipsisSpan(value);
  }
  if (params.isFilterRenderer && value === 0) {
    return createEllipsisSpan("(No stars)");
  }

  const numericValue =
    typeof value === "string" ? parseInt(value, 10) : (value as number);
  const span = document.createElement("span");
  for (let i = 0; i < 5; i += 1) {
    if (numericValue > i) {
      const img = document.createElement("img");
      img.className = "starIcon";
      img.src = starIcon;
      img.alt = `${value} stars`;
      img.width = 12;
      img.height = 12;
      span.append(img);
    }
  }
  return span;
};
