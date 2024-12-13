import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./actionsCellRenderer.css";

export class ActionsCellRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement;

  public init(params: ICellRendererParams): void {
    const { api, node } = params;

    this.eGui = document.createElement("div");
    this.eGui.className = "buttonCell";

    const onRemoveClick = () => {
      const rowData = node.data;
      api.applyTransaction({ remove: [rowData] });
    };

    const onStopSellingClick = () => {
      const rowData = node.data;

      const isPaused = rowData.status === "paused";
      const isOutOfStock = rowData.available <= 0;

      // Modify the status property
      rowData.status = !isPaused
        ? "paused"
        : !isOutOfStock
        ? "active"
        : "outOfStock";

      // Refresh the row to reflect the changes
      api.applyTransaction({ update: [rowData] });
    };

    const removeButton = document.createElement("button");
    removeButton.className = "button-secondary removeButton";
    removeButton.addEventListener("click", onRemoveClick);
    removeButton.innerHTML = `<img src="/example/inventory/delete.svg" alt="delete" />`;
    this.eGui.appendChild(removeButton);

    const stopSellingButton = document.createElement("button");
    stopSellingButton.className = "button-secondary buttonStopSelling";
    stopSellingButton.addEventListener("click", onStopSellingClick);
    stopSellingButton.textContent = "Hold Selling";
    this.eGui.appendChild(stopSellingButton);
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
