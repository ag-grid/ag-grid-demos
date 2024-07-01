import {
  ICellRendererComp,
  ICellRendererParams,
} from "@ag-grid-community/core";

export class TickerCellRenderer implements ICellRendererComp {
  private eGui!: HTMLDivElement;

  public init(params: ICellRendererParams): void {
    const { data } = params;

    this.eGui = document.createElement("div");

    if (data) {
      const imgElement = document.createElement("img");
      imgElement.src = `/example/finance/logos/${data.ticker}.png`;
      imgElement.style.width = "20px";
      imgElement.style.height = "20px";
      imgElement.style.marginRight = "5px";
      imgElement.style.borderRadius = "32px";
      this.eGui.appendChild(imgElement);

      const tickerElement = document.createElement("b");
      tickerElement.className = "custom-ticker";
      tickerElement.textContent = data.ticker;
      this.eGui.appendChild(tickerElement);

      const nameElement = document.createElement("span");
      nameElement.className = "ticker-name";
      nameElement.textContent = data.name;
      this.eGui.appendChild(nameElement);
    }
  }

  public getGui(): HTMLElement {
    return this.eGui;
  }

  public refresh(params: ICellRendererParams): boolean {
    return false;
  }
}
