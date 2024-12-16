import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./tagCellRenderer.css";

export class TagCellRenderer implements ICellRendererComp {
  private eGui: HTMLDivElement;

  init(params: ICellRendererParams): void {
    const { value, valueFormatted } = params;

    this.eGui = document.createElement("div");
    this.eGui.className = `tag ${value}Tag`;

    const circleDiv = document.createElement("div");
    circleDiv.className = `circle ${value}Circle`;
    this.eGui.appendChild(circleDiv);

    const valueSpan = document.createElement("span");
    valueSpan.textContent = valueFormatted!;
    this.eGui.appendChild(valueSpan);
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
