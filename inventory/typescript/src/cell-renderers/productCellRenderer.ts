import type { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

import "./productCellRenderer.css";

export class ProductCellRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement;

  public init(params: ICellRendererParams): void {
    const { value, data } = params;

    this.eGui = document.createElement("div");
    this.eGui.className = "productCell";

    const imageContainer = document.createElement("div");
    imageContainer.className = "image";

    const imageElement = document.createElement("img");
    imageElement.src = `/example/inventory/${data.image}`;
    imageElement.alt = data.image;
    imageContainer.appendChild(imageElement);
    this.eGui.appendChild(imageContainer);

    const textContainer = document.createElement("div");

    const nameElement = document.createElement("div");
    nameElement.textContent = value;
    textContainer.appendChild(nameElement);

    const categoryElement = document.createElement("div");
    categoryElement.className = "stockCell";
    categoryElement.textContent = data.category;
    textContainer.appendChild(categoryElement);

    this.eGui.appendChild(textContainer);
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: ICellRendererParams): boolean {
    return true;
  }
}
