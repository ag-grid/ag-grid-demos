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
  type ColDef,
  colorSchemeDark,
  type GetRowIdFunc,
  type GetRowIdParams,
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
  selector: 'app-finance-example',
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
  @Input() updateInterval: number = DEFAULT_UPDATE_INTERVAL;
  @Input() enableRowGroup?: boolean;

  private intervalId?: ReturnType<typeof setInterval>;
  private observer?: IntersectionObserver;

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
    return [
      {
        field: 'ticker',
        cellRenderer: TickerCellRenderer,
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
    ];
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
