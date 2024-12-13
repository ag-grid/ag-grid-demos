import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./contactCellRenderer.css";

export class ContactCellRenderer implements ICellRendererComp {
  private eGui: HTMLDivElement;

  init(params: ICellRendererParams) {
    const emailName = params.data.orgHierarchy
      .at(-1)
      .toLowerCase()
      .replace(" ", ".");

    this.eGui = document.createElement("div");
    this.eGui.className = "contactCell";

    const iconContainer = document.createElement("div");
    iconContainer.className = "iconContainer";

    const linkedinButton = document.createElement("button");
    linkedinButton.className = "button-secondary";
    const linkedinLink = document.createElement("a");
    linkedinLink.href = `https://www.linkedin.com/company/ag-grid/`;
    linkedinLink.target = "_blank";
    linkedinLink.rel = "noopener noreferrer";
    linkedinLink.className = "iconLink";
    const linkedinIcon = document.createElement("img");
    linkedinIcon.className = "icon";
    linkedinIcon.src = `/example/hr/linkedin.svg`;
    linkedinIcon.alt = "linkedin";
    linkedinLink.appendChild(linkedinIcon);
    linkedinButton.appendChild(linkedinLink);

    const emailButton = document.createElement("button");
    emailButton.className = "button-secondary";
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${emailName}@company.com`;
    emailLink.className = "iconLink";
    const emailIcon = document.createElement("img");
    emailIcon.className = "icon";
    emailIcon.src = `/example/hr/email.svg`;
    emailIcon.alt = "email";
    emailLink.appendChild(emailIcon);
    emailButton.appendChild(emailLink);

    iconContainer.appendChild(linkedinButton);
    iconContainer.appendChild(emailButton);

    this.eGui.appendChild(iconContainer);
  }

  getGui(): HTMLElement {
    return this.eGui;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
