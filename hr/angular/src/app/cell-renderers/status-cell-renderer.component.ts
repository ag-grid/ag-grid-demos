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
      <img
        *ngIf="value === 'paid'"
        class="tick"
        src="/example/hr/tick.svg"
        alt="tick"
      />
      <span>{{ value }}</span>
    </div>
  `,
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  value = "";
  statusClass = "";

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? "";
    this.statusClass = this.value ? `${this.value}Tag` : "";
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
