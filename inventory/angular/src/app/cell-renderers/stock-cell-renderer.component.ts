import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-stock-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="stock">
      <span>{{ available }}</span>
      <span class="stockText">Stock /</span>
      <span class="variantsText">{{ variants }} Variants</span>
    </div>
  `,
})
export class StockCellRendererComponent implements ICellRendererAngularComp {
  available = 0;
  variants = 0;

  agInit(params: ICellRendererParams): void {
    this.available = params.data?.available ?? 0;
    this.variants = params.data?.variants ?? 0;
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
