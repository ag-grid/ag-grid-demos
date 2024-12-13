import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { Component } from '@angular/core';

@Component({
  selector: 'flag-cell-renderer',
  standalone: true,
  template: `
    <div class="flagCell">
      <div class="employeeData">
        <span>{{ value }}</span>
      </div>
      <img
        class="flagImage"
        [src]="'/example/hr/' + flag + '.svg'"
        [alt]="value?.toLowerCase()"
      />
    </div>
  `,
  styles: [
    `
      .flagCell {
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        justify-content: left;
        gap: 8px;
      }

      .employeeData {
        display: flex;
        flex-direction: column;
      }

      .employeeData > span {
        line-height: 20px;
      }

      .flagImage {
        position: relative;
        width: 33px;
        height: 27px;
        top: 4px;
      }
    `,
  ],
})
export class FlagCellRenderer implements ICellRendererAngularComp {
  public value?: string;
  public flag?: string;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.flag = params.data.flag;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.flag = params.data.flag;
    return true;
  }
}
