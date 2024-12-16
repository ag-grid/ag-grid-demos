import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./priceCellRenderer.css";

export class PriceCellRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement;

  public init(params: ICellRendererParams): void {
    const { value, data } = params;

    this.eGui = document.createElement("div");
    this.eGui.className = "price";

    const priceAmountElement = document.createElement("span");
    priceAmountElement.className = "priceAmount";
    priceAmountElement.textContent = `£${value}`;
    this.eGui.appendChild(priceAmountElement);

    const increaseElement = document.createElement("span");
    increaseElement.className = "increase";
    increaseElement.textContent = `${data.priceIncrease}% increase`;
    this.eGui.appendChild(increaseElement);
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
