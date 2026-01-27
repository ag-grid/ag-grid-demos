import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import type { ICellRendererAngularComp } from "ag-grid-angular";
import type { ICellRendererParams } from "ag-grid-community";

interface TickerCellParams extends ICellRendererParams {
  hideTickerName?: boolean;
}

@Component({
  standalone: true,
  selector: "app-ticker-cell-renderer",
  imports: [CommonModule],
  template: `
    <div class="ticker-cell" *ngIf="data">
      <img [src]="logoUrl" [alt]="altText" />
      <b class="custom-ticker">{{ data.ticker }}</b>
      <span class="ticker-name" *ngIf="!hideTickerName">
        {{ data.name }}
      </span>
    </div>
  `,
})
export class TickerCellRendererComponent implements ICellRendererAngularComp {
  data?: { ticker: string; name: string };
  hideTickerName = false;
  logoUrl = "";
  altText = "";

  agInit(params: TickerCellParams): void {
    this.data = params.data;
    this.hideTickerName = params.hideTickerName ?? false;
    this.logoUrl = this.data
      ? `/example/finance/logos/${this.data.ticker}.png`
      : "";
    this.altText = this.data ? `${this.data.name} logo` : "";
  }

  refresh(params: TickerCellParams): boolean {
    this.agInit(params);
    return true;
  }
}
