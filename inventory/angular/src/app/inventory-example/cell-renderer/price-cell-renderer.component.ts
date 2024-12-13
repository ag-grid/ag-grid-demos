import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'price-cell-renderer',
  standalone: true,
  template: `
    <div class="price">
      <span class="priceAmount">£{{ value }}</span>
      <span class="increase">{{ priceIncrease }}% increase</span>
    </div>
  `,
  styles: [
    `
      .price {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .price span {
        line-height: 100%;
      }

      .increase {
        opacity: 0.7;
      }
    `,
  ],
})
export class PriceCellRenderer implements ICellRendererAngularComp {
  public value: number | string = '';
  public priceIncrease: number = 0;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.priceIncrease = params.data.priceIncrease;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.priceIncrease = params.data.priceIncrease;
    return true;
  }
}
