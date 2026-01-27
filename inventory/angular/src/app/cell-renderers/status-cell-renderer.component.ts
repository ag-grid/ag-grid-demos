import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-status-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="tag" [ngClass]="statusClass">
      <div class="circle" [ngClass]="circleClass"></div>
      <span>{{ valueFormatted || value }}</span>
    </div>
  `,
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  value = "";
  valueFormatted = "";
  statusClass = "";
  circleClass = "";

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? "";
    this.valueFormatted = params.valueFormatted ?? "";
    this.statusClass = this.value ? `${this.value}Tag` : "";
    this.circleClass = this.value ? `${this.value}Circle` : "";
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
