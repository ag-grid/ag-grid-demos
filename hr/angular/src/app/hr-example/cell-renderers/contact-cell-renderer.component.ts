import type { ICellRendererAngularComp } from 'ag-grid-angular';
import type { ICellRendererParams } from 'ag-grid-community';
import { Component } from '@angular/core';

@Component({
  selector: 'contact-cell-renderer',
  standalone: true,
  template: `
    <div class="contactCell">
      <div class="iconContainer">
        <button class="button-secondary">
          <a
            [href]="'https://www.linkedin.com/company/ag-grid/'"
            target="_blank"
            rel="noopener noreferrer"
            class="iconLink"
          >
            <img class="icon" src="/example/hr/linkedin.svg" alt="linkedin" />
          </a>
        </button>
        <button class="button-secondary">
          <a [href]="'mailto:' + emailName + '@company.com'" class="iconLink">
            <img class="icon" src="/example/hr/email.svg" alt="email" />
          </a>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .icon {
        height: 16px;
        width: 16px;
        padding-top: 1px;
      }

      .iconContainer button {
        appearance: none;
        display: inline-block;
        margin: 8px;
        width: 30px;
        padding: 0.375em 1em 0.5em;
        white-space: nowrap;
        border-radius: 6px;
        box-shadow: 0 0 0 4px transparent, 0 1px 2px 0 #0c111d11;
        outline: none;
        background-color: var(--ag-background-color);
        border: 1px solid #d0d5dd;
        cursor: pointer;
      }

      :global(.ag-theme-quartz-dark) .iconContainer button {
        background-color: #141d2c;
        border-color: #344054;
      }

      .iconLink {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class ContactCellRenderer implements ICellRendererAngularComp {
  public emailName: string = '';

  agInit(params: ICellRendererParams): void {
    this.emailName = params.data.orgHierarchy
      .at(-1)
      .toLowerCase()
      .replace(' ', '.');
  }

  refresh(params: ICellRendererParams): boolean {
    this.emailName = params.data.orgHierarchy
      .at(-1)
      .toLowerCase()
      .replace(' ', '.');
    return true;
  }
}
