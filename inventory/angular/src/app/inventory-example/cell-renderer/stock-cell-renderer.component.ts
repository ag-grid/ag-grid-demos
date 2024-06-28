import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';

@Component({
  selector: 'stock-cell-renderer',
  standalone: true,
  template: `
    <div class="stock">
      <span>{{ available }}</span>
      <span class="stockText">Stock /</span>
      <span class="variantsText">{{ variants }} Variants</span>
    </div>
  `,
  styles: [
    `
      .stockText {
        opacity: 0.7;
      }

      .variantsText {
        opacity: 0.7;
      }
    `,
  ],
})
export class StockCellRenderer implements ICellRendererAngularComp {
  public available: number | string = '';
  public variants: number = 0;

  agInit(params: ICellRendererParams): void {
    this.available = params.data.available;
    this.variants = params.data.variants;
  }

  refresh(params: ICellRendererParams): boolean {
    this.available = params.data.available;
    this.variants = params.data.variants;
    return true;
  }
}
