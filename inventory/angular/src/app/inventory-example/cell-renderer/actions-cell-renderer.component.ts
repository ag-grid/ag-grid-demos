import { Component } from '@angular/core';
import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';

@Component({
  selector: 'actions-cell-renderer',
  standalone: true,
  template: `
    <div class="buttonCell">
      <button class="button-secondary removeButton" (click)="onRemoveClick()">
        <img src="/example/inventory/delete.svg" alt="delete" />
      </button>
      <button
        class="button-secondary buttonStopSelling"
        (click)="onStopSellingClick()"
      >
        Hold Selling
      </button>
    </div>
  `,
  styles: [
    `
      .buttonCell {
        display: flex;
        gap: 8px;
        flex-direction: row-reverse;
      }

      .removeButton {
        display: flex !important;
        justify-content: center;
        align-items: center;

        height: 40px;
        width: 40px;
      }

      .removeButton img {
        width: 20px;
      }

      .buttonStopSelling {
        height: 40px;
        line-height: 1.8;
      }
    `,
  ],
})
export class ActionsCellRenderer implements ICellRendererAngularComp {
  private params!: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams): boolean {
    this.params = params;
    return true;
  }

  onRemoveClick(): void {
    const rowData = this.params.node.data;
    this.params.api.applyTransaction({ remove: [rowData] });
  }

  onStopSellingClick(): void {
    const rowData = this.params.node.data;
    const isPaused = rowData.status === 'paused';
    const isOutOfStock = rowData.available <= 0;

    // Modify the status property
    rowData.status = !isPaused
      ? 'paused'
      : !isOutOfStock
        ? 'active'
        : 'outOfStock';

    // Refresh the row to reflect the changes
    this.params.api.applyTransaction({ update: [rowData] });
  }
}
