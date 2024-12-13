import type { ICellRendererParams } from 'ag-grid-community';
import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ticker-cell-renderer',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="data" style="display: flex; align-items: center; gap: 5px">
      <img
        [src]="'/example/finance/logos/' + data.ticker + '.png'"
        style="width: 20px; height: 20px; border-radius: 32px;"
      />
      <b class="custom-ticker">{{ data.ticker }}</b>
      <span class="ticker-name">{{ data.name }}</span>
    </div>
  `,
})
export class TickerCellRenderer {
  @Input() data: any;

  agInit(params: ICellRendererParams): void {
    this.data = params.data;
  }

  refresh(params: ICellRendererParams): boolean {
    this.data = params.data;
    return true;
  }
}
