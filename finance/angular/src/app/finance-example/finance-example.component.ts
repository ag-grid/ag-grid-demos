import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { AgChartsEnterpriseModule } from 'ag-charts-enterprise';
import {
  colorSchemeDark,
  type ColDef,
  type GetRowIdFunc,
  type GetRowIdParams,
  type GridSizeChangedEvent,
  ModuleRegistry,
  themeQuartz,
  type ValueFormatterFunc,
  type ValueGetterParams,
} from 'ag-grid-community';
import { AllEnterpriseModule } from 'ag-grid-enterprise';
import { AgGridAngular } from 'ag-grid-angular';

import { getData } from './data';

import { TickerCellRenderer } from './renderers/ticker-cell-renderer.component';
import { sparklineTooltipRenderer } from './renderers/sparklineTooltipRenderer';

const DEFAULT_UPDATE_INTERVAL = 60;
const PERCENTAGE_CHANGE = 20;
type Breakpoint = 'small' | 'medium' | 'medLarge' | 'large' | 'xlarge';
type ColWidth = number | 'auto';

const BREAKPOINT_CONFIG: Record<
  Breakpoint,
  {
    breakpoint?: number;
    columns: string[];
    tickerColumnWidth: ColWidth;
    timelineColumnWidth: ColWidth;
    hideTickerName?: boolean;
  }
> = {
  small: {
    breakpoint: 500,
    columns: ['ticker', 'timeline'],
    tickerColumnWidth: 'auto',
    timelineColumnWidth: 'auto',
    hideTickerName: true,
  },
  medium: {
    breakpoint: 850,
    columns: ['ticker', 'timeline', 'totalValue'],
    tickerColumnWidth: 180,
    timelineColumnWidth: 140,
    hideTickerName: true,
  },
  medLarge: {
    breakpoint: 900,
    tickerColumnWidth: 340,
    timelineColumnWidth: 140,
    columns: ['ticker', 'timeline', 'totalValue', 'p&l'],
  },
  large: {
    breakpoint: 1100,
    tickerColumnWidth: 340,
    timelineColumnWidth: 140,
    columns: ['ticker', 'timeline', 'totalValue', 'p&l'],
  },
  xlarge: {
    tickerColumnWidth: 340,
    timelineColumnWidth: 140,
    columns: [
      'ticker',
      'timeline',
      'totalValue',
      'p&l',
      'instrument',
      'price',
      'quantity',
    ],
  },
};

ModuleRegistry.registerModules([
  AllEnterpriseModule.with(AgChartsEnterpriseModule),
]);

const numberFormatter: ValueFormatterFunc = (params) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 2,
  });
  return params.value == null ? '' : formatter.format(params.value);
};

@Component({
  selector: 'finance-example',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './finance-example.component.html',
  styleUrl: './finance-example.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FinanceExample implements AfterViewInit, OnDestroy {
  @ViewChild('gridWrapper', { static: true })
  gridWrapper!: ElementRef<HTMLDivElement>;
  @Input() isDarkMode: boolean = false;
  @Input() isSmallerGrid?: boolean;
  @Input() updateInterval: number = DEFAULT_UPDATE_INTERVAL;
  @Input() enableRowGroup?: boolean;

  private intervalId?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;
  breakpoint: Breakpoint = 'xlarge';

  get theme() {
    return this.isDarkMode
      ? themeQuartz.withPart(colorSchemeDark)
      : themeQuartz;
  }

  rowData = getData();
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.ticker;
  cellSelection: boolean = true;
  enableCharts: boolean = true;
  get rowGroupPanelShow(): 'always' | 'onlyWhenGrouping' | 'never' | undefined {
    return this.enableRowGroup ? 'always' : 'never';
  }
  suppressAggFuncInHeader: boolean = true;
  groupDefaultExpanded = -1;

  get defaultColDef(): ColDef {
    return {
      flex: 1,
      filter: true,
      enableRowGroup: this.enableRowGroup,
      enableValue: true,
    };
  }

  colDefs: ColDef[] = this.createColDefs();

  statusBar = {
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent' },
      { statusPanel: 'agTotalRowCountComponent' },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  };

  createColDefs(): ColDef[] {
    const breakpointConfig = BREAKPOINT_CONFIG[this.breakpoint];
    const tickerWidthDefs =
      breakpointConfig.tickerColumnWidth === 'auto'
        ? { flex: 1 }
        : {
            initialWidth: breakpointConfig.tickerColumnWidth as number,
            minWidth: breakpointConfig.tickerColumnWidth as number,
          };
    const timelineWidthDefs =
      breakpointConfig.timelineColumnWidth === 'auto'
        ? { flex: 1 }
        : {
            initialWidth: breakpointConfig.timelineColumnWidth as number,
            minWidth: breakpointConfig.timelineColumnWidth as number,
          };

    const allColDefs: ColDef[] = [
      {
        field: 'ticker',
        cellRenderer: TickerCellRenderer,
        cellRendererParams: {
          hideTickerName: Boolean(breakpointConfig.hideTickerName),
        },
        ...tickerWidthDefs,
      },
      {
        headerName: 'Timeline',
        field: 'timeline',
        sortable: false,
        filter: false,
        cellRenderer: 'agSparklineCellRenderer',
        cellRendererParams: {
          sparklineOptions: {
            type: 'bar',
            direction: 'vertical',
            axis: {
              strokeWidth: 0,
            },
            tooltip: {
              renderer: sparklineTooltipRenderer,
            },
          },
        },
        ...timelineWidthDefs,
      },
      {
        field: 'instrument',
        cellDataType: 'text',
        type: 'rightAligned',
        minWidth: 100,
        initialWidth: 100,
      },
      {
        colId: 'p&l',
        headerName: 'P&L',
        cellDataType: 'number',
        filter: 'agNumberColumnFilter',
        type: 'rightAligned',
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueGetter: ({ data }: ValueGetterParams) =>
          data && data.quantity * (data.price / data.purchasePrice),
        valueFormatter: numberFormatter,
        aggFunc: 'sum',
        minWidth: 140,
        initialWidth: 140,
      },
      {
        colId: 'totalValue',
        headerName: 'Total Value',
        type: 'rightAligned',
        cellDataType: 'number',
        filter: 'agNumberColumnFilter',
        valueGetter: ({ data }: ValueGetterParams) =>
          data && data.quantity * data.price,
        cellRenderer: 'agAnimateShowChangeCellRenderer',
        valueFormatter: numberFormatter,
        aggFunc: 'sum',
        minWidth: 160,
        initialWidth: 160,
      },
    ];

    if (!this.isSmallerGrid) {
      allColDefs.push(
        {
          field: 'quantity',
          cellDataType: 'number',
          type: 'rightAligned',
          valueFormatter: numberFormatter,
          maxWidth: 75,
        },
        {
          headerName: 'Price',
          field: 'purchasePrice',
          cellDataType: 'number',
          type: 'rightAligned',
          valueFormatter: numberFormatter,
          maxWidth: 75,
        },
      );
    }

    return allColDefs.filter(
      (cDef) =>
        breakpointConfig.columns.includes(cDef.field as string) ||
        breakpointConfig.columns.includes(cDef.colId as string),
    );
  }

  onGridSizeChanged(params: GridSizeChangedEvent) {
    if (params.clientWidth < BREAKPOINT_CONFIG.small.breakpoint!) {
      this.breakpoint = 'small';
    } else if (params.clientWidth < BREAKPOINT_CONFIG.medium.breakpoint!) {
      this.breakpoint = 'medium';
    } else if (params.clientWidth < BREAKPOINT_CONFIG.medLarge.breakpoint!) {
      this.breakpoint = 'medLarge';
    } else if (params.clientWidth < BREAKPOINT_CONFIG.large.breakpoint!) {
      this.breakpoint = 'large';
    } else {
      this.breakpoint = 'xlarge';
    }

    this.colDefs = this.createColDefs();
  }

  createUpdater() {
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
    }, this.updateInterval);
  }

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        clearInterval(this.intervalId);
        this.intervalId = this.createUpdater();
      } else {
        clearInterval(this.intervalId);
      }
    });

    this.observer.observe(this.gridWrapper.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    clearInterval(this.intervalId);
  }
}
