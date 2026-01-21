import { ICellRendererComp, ICellRendererParams } from "ag-grid-community";

export const getTickerCellRenderer = (hideTickerName: boolean) => {
  return class TickerCellRenderer implements ICellRendererComp {
    private eGui!: HTMLDivElement;

    public init(params: ICellRendererParams): void {
      const { data } = params;

      this.eGui = document.createElement("div");
      this.eGui.style.display = "flex";
      this.eGui.style.alignItems = "center";
      this.eGui.style.gap = "5px";

      if (data) {
        const imgElement = document.createElement("img");
        imgElement.src = `/example/finance/logos/${data.ticker}.png`;
        imgElement.style.width = "20px";
        imgElement.style.height = "20px";
        imgElement.style.borderRadius = "32px";
        this.eGui.appendChild(imgElement);

        const tickerElement = document.createElement("b");
        tickerElement.className = "custom-ticker";
        tickerElement.textContent = data.ticker;
        this.eGui.appendChild(tickerElement);

        if (!hideTickerName) {
          const nameElement = document.createElement("span");
          nameElement.className = "ticker-name";
          nameElement.textContent = data.name;
          this.eGui.appendChild(nameElement);
        }
      }
    }

    public getGui(): HTMLElement {
      return this.eGui;
    }

    public refresh(_params: ICellRendererParams): boolean {
      return false;
    }
  };
};
