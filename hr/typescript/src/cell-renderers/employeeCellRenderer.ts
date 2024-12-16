import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./employeeCellRenderer.css";

export class EmployeeCellRenderer implements ICellRendererComp {
  private eGui: HTMLDivElement;

  init(params: ICellRendererParams): void {
    const { value, data } = params;
    const { image, jobTitle } = data;

    this.eGui = document.createElement("div");
    this.eGui.className = "employeeCell";

    const employeeData = document.createElement("div");
    employeeData.className = "employeeData";

    const valueSpan = document.createElement("span");
    valueSpan.textContent = value;

    const descriptionSpan = document.createElement("span");
    descriptionSpan.textContent = jobTitle;
    descriptionSpan.className = "description";

    employeeData.appendChild(valueSpan);
    employeeData.appendChild(descriptionSpan);

    const imageElement = document.createElement("img");
    imageElement.className = "image";
    imageElement.src = `/example/hr/${image}.png`;
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
