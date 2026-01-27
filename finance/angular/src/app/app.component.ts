import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import { AgGridAngular } from "ag-grid-angular";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  type ColDef,
  type GetRowIdParams,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueGetterParams,
} from "ag-grid-community";
import {
  AdvancedFilterModule,
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  IntegratedChartsModule,
  RichSelectModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SparklinesModule,
  StatusBarModule,
} from "ag-grid-enterprise";
import { getData } from "./data";
import { TickerCellRendererComponent } from "./ticker-cell-renderer.component";

const DEFAULT_UPDATE_INTERVAL = 60;
const PERCENTAGE_CHANGE = 20;

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  AdvancedFilterModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
  CellSelectionModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  RichSelectModule,
  StatusBarModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  SparklinesModule.with(AgChartsEnterpriseModule),
  ClipboardModule,
]);

const numberFormatter: ValueFormatterFunc = ({ value }) => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
  });
  return value == null ? "" : formatter.format(value);
};

@Component({
  standalone: true,
  selector: "app-root",
  imports: [CommonModule, AgGridAngular, TickerCellRendererComponent],
  template: `
    <div #gridWrapper [ngClass]="gridClasses" [ngStyle]="gridStyle">
      <ag-grid-angular
        [rowData]="rowData"
        [columnDefs]="colDefs"
        [defaultColDef]="defaultColDef"
        [getRowId]="getRowId"
        [statusBar]="statusBar"
        [components]="components"
        [chartThemes]="chartThemes"
        [cellSelection]="true"
        [enableCharts]="true"
        [rowGroupPanelShow]="rowGroupPanelShow"
        [suppressAggFuncInHeader]="true"
        [groupDefaultExpanded]="-1"
      >
      </ag-grid-angular>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  constructor(private readonly cdr: ChangeDetectorRef) {}

  @ViewChild("gridWrapper", { static: true })
  private gridWrapper?: ElementRef<HTMLDivElement>;

  gridTheme = "ag-theme-quartz";
  isDarkMode = false;
  gridHeight: number | null = null;
  isSmallerGrid = false;
  updateInterval = DEFAULT_UPDATE_INTERVAL;
  enableRowGroup = false;

  rowData = getData();
  colDefs: ColDef[] = this.buildColDefs();
  defaultColDef: ColDef = {
    flex: 1,
    filter: true,
    enableRowGroup: this.enableRowGroup,
    enableValue: true,
  };
  statusBar = {
    statusPanels: [
      { statusPanel: "agTotalAndFilteredRowCountComponent" },
      { statusPanel: "agTotalRowCountComponent" },
      { statusPanel: "agFilteredRowCountComponent" },
      { statusPanel: "agSelectedRowCountComponent" },
      { statusPanel: "agAggregationComponent" },
    ],
  };
  components = {
    tickerCellRenderer: TickerCellRendererComponent,
  };

  private intervalId: ReturnType<typeof setInterval> | null = null;
  private observer: IntersectionObserver | null = null;

  get gridClasses() {
    return {
      [this.themeClass]: true,
      grid: true,
      gridHeight: !this.gridHeight,
    };
  }

  get gridStyle() {
    return this.gridHeight ? { height: `${this.gridHeight}px` } : null;
  }

  get chartThemes() {
    return this.isDarkMode ? ["ag-default-dark"] : ["ag-default"];
  }

  get rowGroupPanelShow() {
    return this.enableRowGroup ? "always" : "never";
  }

  get themeClass() {
    return `${this.gridTheme}${this.isDarkMode ? "-dark" : ""}`;
  }

  getRowId = (params: GetRowIdParams) => params.data.ticker;

  ngAfterViewInit() {
    if (!this.gridWrapper?.nativeElement) {
      return;
    }
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry) {
        return;
      }
      if (entry.isIntersecting) {
        if (!this.intervalId) {
          this.intervalId = this.createUpdater();
        }
      } else {
        this.clearUpdater();
      }
    });
    this.observer.observe(this.gridWrapper.nativeElement);
  }

  ngOnDestroy() {
    this.clearUpdater();
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private createUpdater() {
    return setInterval(() => {
      this.rowData = this.rowData.map((item) => {
        const isRandomChance = Math.random() < 0.1;
        if (!isRandomChance) {
          return item;
        }
        const rnd = (Math.random() * PERCENTAGE_CHANGE) / 100;
        const change = Math.random() > 0.5 ? 1 - rnd : 1 + rnd;
        const price =
          item.price < 10
            ? item.price * change
            : // Increase price if it is too low, so it does not hang around 0
              Math.random() * 40 + 10;

        const timeline = item.timeline
          .slice(1, item.timeline.length)
          .concat(Number(price.toFixed(2)));

        return {
          ...item,
          price,
          timeline,
        };
      });
      this.cdr.markForCheck();
    }, this.updateInterval);
  }

  private clearUpdater() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private buildColDefs(): ColDef[] {
    const allColDefs: ColDef[] = [
      {
        field: "ticker",
        cellRenderer: "tickerCellRenderer",
        cellRendererParams: {
          hideTickerName: false,
        },
        initialWidth: 340,
        minWidth: 340,
      },
      {
        headerName: "Timeline",
        field: "timeline",
        sortable: false,
        filter: false,
        cellRenderer: "agSparklineCellRenderer",
        cellRendererParams: {
          sparklineOptions: {
            type: "bar",
            direction: "vertical",
            axis: {
              strokeWidth: 0,
            },
          },
        },
        initialWidth: 140,
        minWidth: 140,
      },
      {
        field: "instrument",
        cellDataType: "text",
        type: "rightAligned",
        minWidth: 100,
        initialWidth: 100,
      },
      {
        colId: "p&l",
        headerName: "P&L",
        cellDataType: "number",
        filter: "agNumberColumnFilter",
        type: "rightAligned",
        cellRenderer: "agAnimateShowChangeCellRenderer",
        valueGetter: ({ data }: ValueGetterParams) =>
          data && data.quantity * (data.price / data.purchasePrice),
        valueFormatter: numberFormatter,
        aggFunc: "sum",
        minWidth: 140,
        initialWidth: 140,
      },
      {
        colId: "totalValue",
        headerName: "Total Value",
        type: "rightAligned",
        cellDataType: "number",
        filter: "agNumberColumnFilter",
        valueGetter: ({ data }: ValueGetterParams) =>
          data && data.quantity * data.price,
        cellRenderer: "agAnimateShowChangeCellRenderer",
        valueFormatter: numberFormatter,
        aggFunc: "sum",
        minWidth: 160,
        initialWidth: 160,
      },
    ];

    if (!this.isSmallerGrid) {
      allColDefs.push(
        {
          field: "quantity",
          cellDataType: "number",
          type: "rightAligned",
          valueFormatter: numberFormatter,
          maxWidth: 75,
        },
        {
          headerName: "Price",
          field: "purchasePrice",
          cellDataType: "number",
          type: "rightAligned",
          valueFormatter: numberFormatter,
          maxWidth: 75,
        },
      );
    }

    return allColDefs;
  }
}
