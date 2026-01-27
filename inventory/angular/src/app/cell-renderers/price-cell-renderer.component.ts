import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-price-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="price">
      <span class="priceAmount">£{{ value }}</span>
      <span class="increase">{{ priceIncrease }}% increase</span>
    </div>
  `,
})
export class PriceCellRendererComponent implements ICellRendererAngularComp {
  value: string | number = "";
  priceIncrease: number | string = "";

  agInit(params: ICellRendererParams): void {
    this.value = params.value ?? "";
    this.priceIncrease = params.data?.priceIncrease ?? "";
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
