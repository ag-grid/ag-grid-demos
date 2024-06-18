import { Component, Input, ViewEncapsulation } from '@angular/core';

import {
  type ColDef,
  type GetRowIdFunc,
  type GetRowIdParams,
  type GridReadyEvent,
  type ValueFormatterFunc,
} from '@ag-grid-community/core';
import { AgGridAngular } from '@ag-grid-community/angular';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { ModuleRegistry } from '@ag-grid-community/core';
import { AdvancedFilterModule } from '@ag-grid-enterprise/advanced-filter';
import { GridChartsModule } from '@ag-grid-enterprise/charts-enterprise';
import { ColumnsToolPanelModule } from '@ag-grid-enterprise/column-tool-panel';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { FiltersToolPanelModule } from '@ag-grid-enterprise/filter-tool-panel';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { RichSelectModule } from '@ag-grid-enterprise/rich-select';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import { SetFilterModule } from '@ag-grid-enterprise/set-filter';
import { SparklinesModule } from '@ag-grid-enterprise/sparklines';
import { StatusBarModule } from '@ag-grid-enterprise/status-bar';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import { getData } from './data';

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  AdvancedFilterModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  GridChartsModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  RichSelectModule,
  StatusBarModule,
  SparklinesModule,
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
export class FinanceExample {
  @Input() gridTheme: string = 'ag-theme-quartz';
  @Input() isDarkMode: boolean = false;

  themeClass = `${this.gridTheme}${this.isDarkMode ? '-dark' : ''}`;

  rowData = getData();
  getRowId: GetRowIdFunc = (params: GetRowIdParams) => params.data.ticker;
  onGridReady(params: GridReadyEvent) {
    setInterval(() => {
      this.rowData = this.rowData.map((item) =>
        Math.random() < 0.1
          ? {
              ...item,
              price:
                item.price +
                item.price *
                  ((Math.random() * 4 + 1) / 100) *
                  (Math.random() > 0.5 ? 1 : -1),
            }
          : item,
      );
    }, 1000);
  }
  enableRangeSelection: boolean = true;
  rowSelection: 'multiple' | 'single' | undefined = 'multiple';
  enableCharts: boolean = true;
  rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never' | undefined =
    'always';
  suppressAggFuncInHeader: boolean = true;
  groupDefaultExpanded = -1;

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 140,
    maxWidth: 180,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    enableValue: true,
  };
  colDefs: ColDef[] = [
    {
      field: 'ticker',
      cellDataType: 'text',
      maxWidth: 140,
    },
    {
      field: 'name',
      cellDataType: 'text',
      hide: true,
    },
    {
      field: 'instrument',
      cellDataType: 'text',
      rowGroup: true,
      hide: true,
    },
    {
      headerName: 'P&L',
      cellDataType: 'number',
      type: 'rightAligned',
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      valueGetter: (params) =>
        params.data &&
        params.data.quantity * (params.data.price / params.data.purchasePrice),
      valueFormatter: numberFormatter,
      aggFunc: 'sum',
    },
    {
      headerName: 'Total Value',
      type: 'rightAligned',
      cellDataType: 'number',
      valueGetter: (params) =>
        params.data && params.data.quantity * params.data.price,
      cellRenderer: 'agAnimateShowChangeCellRenderer',
      valueFormatter: numberFormatter,
      aggFunc: 'sum',
    },
    {
      field: 'quantity',
      cellDataType: 'number',
      maxWidth: 140,
      type: 'rightAligned',
      valueFormatter: numberFormatter,
    },
    {
      field: 'purchasePrice',
      cellDataType: 'number',
      maxWidth: 140,
      type: 'rightAligned',
      valueFormatter: numberFormatter,
    },
    {
      field: 'purchaseDate',
      cellDataType: 'dateString',
      type: 'rightAligned',
    },
    {
      headerName: 'Last 24hrs',
      field: 'last24',
      maxWidth: 500,
      cellRenderer: 'agSparklineCellRenderer',
    },
  ];

  statusBar = {
    statusPanels: [
      { statusPanel: 'agTotalAndFilteredRowCountComponent' },
      { statusPanel: 'agTotalRowCountComponent' },
      { statusPanel: 'agFilteredRowCountComponent' },
      { statusPanel: 'agSelectedRowCountComponent' },
      { statusPanel: 'agAggregationComponent' },
    ],
  };
}
