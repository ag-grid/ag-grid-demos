import {
  ICellRendererComp,
  ICellRendererParams,
} from "@ag-grid-community/core";

import "./statusCellRenderer.css";

export class StatusCellRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement;

  public init(params: ICellRendererParams): void {
    const { value, valueFormatted } = params;

    this.eGui = document.createElement("div");
    this.eGui.className = `tag ${value}Tag`;

    const circleElement = document.createElement("div");
    circleElement.className = `circle ${value}Circle`;
    this.eGui.appendChild(circleElement);

    const spanElement = document.createElement("span");
    spanElement.textContent = valueFormatted!;
    this.eGui.appendChild(spanElement);
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
