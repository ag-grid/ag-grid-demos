import { ICellRendererAngularComp } from '@ag-grid-community/angular';
import { ICellRendererParams } from '@ag-grid-community/core';
import { Component } from '@angular/core';

@Component({
  selector: 'tag-cell-renderer',
  standalone: true,
  template: `
    <div class="tag {{ value + 'Tag' }}">
      <div class="circle {{ value + 'Circle' }}"></div>
      <span>{{ valueFormatted }}</span>
    </div>
  `,
  styles: [
    `
      .tag {
        padding: 4px;
        border-radius: 6px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        font-weight: 500;
        display: flex;
        align-items: center;
        height: 24px;
        font-size: 13px;
        padding-right: 8px;
      }

      .designTag {
        border: 1px solid #7e80e751;
      }

      .engineeringTag {
        border: 1px solid #f3a33a53;
      }

      .executiveManagementTag {
        border: 1px solid #47a8f86c;
      }

      .productTag {
        border: 1px solid #88cf2b55;
      }

      .customerSupportTag,
      .legalTag {
        border: 1px solid #cccccc;
      }

      .circle {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
        margin-left: 6px;
      }

      .designCircle {
        background-color: #7e80e7;
      }

      .engineeringCircle {
        background-color: #f3a23a;
      }

      .executiveManagementCircle {
        background-color: #47a8f8;
      }

      .productCircle {
        background-color: #87cf2b;
      }

      .customerSupportCircle,
      .legalCircle {
        background-color: #cccccc;
      }
    `,
  ],
})
export class TagCellRenderer implements ICellRendererAngularComp {
  public value?: string;
  public valueFormatted?: string;

  agInit(params: ICellRendererParams): void {
    this.value = params.value;
    this.valueFormatted = params.valueFormatted!;
  }

  refresh(params: ICellRendererParams): boolean {
    this.value = params.value;
    this.valueFormatted = params.valueFormatted!;
    return true;
  }
}
