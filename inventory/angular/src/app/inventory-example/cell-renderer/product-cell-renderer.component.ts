import { Component } from '@angular/core';
import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'product-cell-renderer',
  standalone: true,
  template: `
    <div class="productCell">
      <div class="image">
        <img [src]="'/example/inventory/' + image + '.png'" [alt]="image" />
      </div>
      <div>
        <div>{{ value }}</div>
        <div class="stockCell">{{ category }}</div>
      </div>
    </div>
  `,
  styles: [
    `
      .productCell {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }

      .image {
        max-width: 100%;
        max-height: 100px;
        background-color: rgba(201, 201, 201, 0.2);
        border-radius: 8px;
        margin: 8px;
      }

      .image img {
        width: 60px;
        height: 60px;
      }

      .productCell div:first-child {
        font-weight: 500;
      }

      .productCell div {
        padding-bottom: 0;
        line-height: 1.5;
      }

      .productCell img {
        border-radius: 8px;
      }

      .stockCell {
        background-color: var(--color-bg-secondary);
        color: var(--color-text-secondary);
        width: fit-content;
        border: 1px solid #c0c0c057;
        border-radius: 6px;
        padding-top: 2px;
        margin-top: 4px;
        padding-right: 4px;
        padding-left: 4px;
        font-size: 12px;
      }
    `,
  ],
})
export class ProductCellRenderer implements ICellRendererAngularComp {
  public value: string = '';
  public image: string = '';
  public category: string = '';

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.image = params.data.image;
    this.category = params.data.category;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.image = params.data.image;
    this.category = params.data.category;
    return true;
  }
}
