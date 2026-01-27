import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { GridApi, ICellRendererParams, IRowNode } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-actions-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="buttonCell">
      <button class="removeButton" (click)="onRemoveClick()">
        <img src="/example/inventory/delete.svg" alt="delete" />
      </button>
      <button class="buttonStopSelling" (click)="onStopSellingClick()">
        Hold Selling
      </button>
    </div>
  `,
})
export class ActionsCellRendererComponent implements ICellRendererAngularComp {
  private api?: GridApi;
  private node?: IRowNode;

  agInit(params: ICellRendererParams): void {
    this.api = params.api;
    this.node = params.node;
  }

  refresh(params: ICellRendererParams): boolean {
    this.api = params.api;
    this.node = params.node;
    return true;
  }

  onRemoveClick() {
    if (!this.api || !this.node?.data) {
      return;
    }
    this.api.applyTransaction({ remove: [this.node.data] });
  }

  onStopSellingClick() {
    if (!this.api || !this.node?.data) {
      return;
    }
    const rowData = this.node.data;
    const isPaused = rowData.status === "paused";
    const isOutOfStock = rowData.available <= 0;

    rowData.status = !isPaused
      ? "paused"
      : !isOutOfStock
        ? "active"
        : "outOfStock";
    this.api.applyTransaction({ update: [rowData] });
  }
}
