import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-product-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="productCell">
      <div class="image">
        <img [src]="imageUrl" [alt]="imageAlt" />
      </div>
      <div>
        <div>{{ value }}</div>
        <div class="stockCell">{{ category }}</div>
      </div>
    </div>
  `,
})
export class ProductCellRendererComponent implements ICellRendererAngularComp {
  value = "";
  category = "";
  imageUrl = "";
  imageAlt = "";

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? "";
    this.category = params.data?.category ?? "";
    const image = params.data?.image ?? "";
    this.imageUrl = image ? `/example/inventory/${image}` : "";
    this.imageAlt = image ?? "";
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
