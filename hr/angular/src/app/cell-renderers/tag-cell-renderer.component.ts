import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-tag-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="tag" [ngClass]="tagClass">
      <div class="circle" [ngClass]="circleClass"></div>
      <span>{{ valueFormatted || value }}</span>
    </div>
  `,
})
export class TagCellRendererComponent implements ICellRendererAngularComp {
  value = "";
  valueFormatted = "";
  tagClass = "";
  circleClass = "";

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? "";
    this.valueFormatted = params.valueFormatted ?? "";
    this.tagClass = this.value ? `${this.value}Tag` : "";
    this.circleClass = this.value ? `${this.value}Circle` : "";
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
