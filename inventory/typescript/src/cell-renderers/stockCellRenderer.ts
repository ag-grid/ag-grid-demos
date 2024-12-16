import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./stockCellRenderer.css";

export class StockCellRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement;

  public init(params: ICellRendererParams): void {
    const { data } = params;

    this.eGui = document.createElement("div");
    this.eGui.className = "stock";

    const availableSpan = document.createElement("span");
    availableSpan.textContent = `${data.available}`;
    this.eGui.appendChild(availableSpan);

    const stockTextSpan = document.createElement("span");
    stockTextSpan.className = "stockText";
    stockTextSpan.textContent = " Stock / ";
    this.eGui.appendChild(stockTextSpan);

    const variantsTextSpan = document.createElement("span");
    variantsTextSpan.className = "variantsText";
    variantsTextSpan.textContent = `${data.variants} Variants`;
    this.eGui.appendChild(variantsTextSpan);
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
