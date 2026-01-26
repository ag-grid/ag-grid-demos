import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-employee-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="employeeCell">
      <div class="employeeData">
        <span>{{ value }}</span>
        <span class="description">{{ jobTitle }}</span>
      </div>
      <img class="image" [src]="imageUrl" [alt]="altText" />
    </div>
  `,
})
export class EmployeeCellRendererComponent implements ICellRendererAngularComp {
  value = "";
  imageUrl = "";
  altText = "";
  jobTitle = "";

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? "";
    this.jobTitle = params.data?.jobTitle ?? "";
    const image = params.data?.image ?? "";
    this.imageUrl = image ? `/example/hr/${image}.webp` : "";
    this.altText = this.value.toLowerCase();
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
