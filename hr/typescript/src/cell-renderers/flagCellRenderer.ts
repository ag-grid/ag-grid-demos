import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./flagCellRenderer.css";

export class FlagCellRenderer implements ICellRendererComp {
  private eGui: HTMLDivElement;

  init(params: ICellRendererParams): void {
    const { value, data } = params;
    const { flag } = data;

    this.eGui = document.createElement("div");
    this.eGui.className = "flagCell";

    const employeeData = document.createElement("div");
    employeeData.className = "employeeData";

    const valueSpan = document.createElement("span");
    valueSpan.textContent = value;

    employeeData.appendChild(valueSpan);

    const imageElement = document.createElement("img");
    imageElement.className = "flagImage";
    imageElement.src = `/example/hr/${flag}.svg`;
    imageElement.alt = value.toLowerCase();

    this.eGui.appendChild(employeeData);
    this.eGui.appendChild(imageElement);
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
