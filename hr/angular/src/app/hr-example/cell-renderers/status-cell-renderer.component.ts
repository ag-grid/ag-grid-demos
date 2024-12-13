import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'status-cell-renderer',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="tag {{ value + 'Tag' }}">
      <img
        *ngIf="value === 'paid'"
        class="tick"
        src="/example/hr/tick.svg"
        alt="tick"
      />
      <span>{{ value }}</span>
    </div>
  `,
  styles: [
    `
      .tag {
        padding: 4px;
        padding-left: 4px;
        border-radius: 6px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        font-weight: 500;
        display: flex;
        align-items: center;
        height: 24px;
        font-size: 13px;
        text-transform: capitalize;
      }

      .paidTag {
        border: 1.5px solid rgb(70, 227, 114, 0.2);
        color: rgb(62, 184, 97);
        padding-right: 8px;
      }

      .pendingTag {
        border: 1px solid #cccccc;
      }

      .tick {
        height: 16px;
        width: 16px;
        margin-right: 8px;
      }
    `,
  ],
})
export class StatusCellRenderer implements ICellRendererAngularComp {
  public value?: string;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    return true;
  }
}
