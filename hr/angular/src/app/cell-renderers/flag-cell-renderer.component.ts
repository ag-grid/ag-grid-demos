import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-flag-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="flagCell">
      <div class="employeeData">
        <span>{{ value }}</span>
      </div>
      <img class="flagImage" [src]="flagUrl" [alt]="altText" />
    </div>
  `,
})
export class FlagCellRendererComponent implements ICellRendererAngularComp {
  value = "";
  flagUrl = "";
  altText = "";

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? "";
    const flag = params.data?.flag ?? "";
    this.flagUrl = flag ? `/example/hr/${flag}.svg` : "";
    this.altText = this.value.toLowerCase();
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
