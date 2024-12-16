import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./statusCellRenderer.css";

export class StatusCellRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement;
  private circleElement!: HTMLDivElement;
  private spanElement!: HTMLSpanElement;

  public init(params: ICellRendererParams): void {
    this.eGui = document.createElement("div");

    this.circleElement = document.createElement("div");
    this.eGui.appendChild(this.circleElement);

    this.spanElement = document.createElement("span");
    this.eGui.appendChild(this.spanElement);

    this.refresh(params);
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: ICellRendererParams): boolean {
    const { value, valueFormatted } = params;

    this.eGui.className = `tag ${value}Tag`;
    this.circleElement.className = `circle ${value}Circle`;
    this.spanElement.textContent = valueFormatted!;
    return true;
  }
}
