import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./statusCellRenderer.css";

export class StatusCellRenderer implements ICellRendererComp {
  private eGui: HTMLDivElement;

  init(params: ICellRendererParams): void {
    const { value } = params;

    this.eGui = document.createElement("div");
    this.eGui.className = `tag ${value}Tag`;

    if (value === "paid") {
      const tickImg = document.createElement("img");
      tickImg.className = "tick";
      tickImg.src = `/example/hr/tick.svg`;
      tickImg.alt = "tick";
      this.eGui.appendChild(tickImg);
    }

    const valueSpan = document.createElement("span");
    valueSpan.textContent = value;
    this.eGui.appendChild(valueSpan);
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
