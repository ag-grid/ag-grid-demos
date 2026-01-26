import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

@Component({
  standalone: true,
  selector: "app-contact-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="contact-cell">
      <div class="iconContainer">
        <button>
          <a
            href="https://www.linkedin.com/company/ag-grid/"
            target="_blank"
            rel="noopener noreferrer"
            class="iconLink"
          >
            <img class="icon" src="/example/hr/linkedin.svg" alt="linkedin" />
          </a>
        </button>
        <button>
          <a [href]="mailtoLink" class="iconLink">
            <img class="icon" src="/example/hr/email.svg" alt="email" />
          </a>
        </button>
      </div>
    </div>
  `,
})
export class ContactCellRendererComponent implements ICellRendererAngularComp {
  mailtoLink = "";

  agInit(params: ICellRendererParams): void {
    const name = params.data?.orgHierarchy?.at(-1) ?? "";
    const emailName = name.toLowerCase().replace(" ", ".");
    this.mailtoLink = `mailto:${emailName}@company.com`;
  }

  refresh(params: ICellRendererParams): boolean {
    this.agInit(params);
    return true;
  }
}
