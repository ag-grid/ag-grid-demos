import { Component, Input, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AgGridAngular } from 'ag-grid-angular';
import type {
  ColDef,
  GetDetailRowDataParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SizeColumnsToFitGridStrategy,
  ValueFormatterFunc,
  ValueFormatterParams,
  ValueGetterParams,
} from 'ag-grid-community';
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  ModuleRegistry,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {
  ExcelExportModule,
  MasterDetailModule,
  MultiFilterModule,
  SetFilterModule,
} from 'ag-grid-enterprise';

import { getData } from './data';
import { ProductCellRenderer } from './cell-renderer/product-cell-renderer.component';
import { StatusCellRenderer } from './cell-renderer/status-cell-renderer.component';
import { StockCellRenderer } from './cell-renderer/stock-cell-renderer.component';
import { PriceCellRenderer } from './cell-renderer/price-cell-renderer.component';
import { ActionsCellRenderer } from './cell-renderer/actions-cell-renderer.component';

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
  ExcelExportModule,
  SetFilterModule,
  MultiFilterModule,
  MasterDetailModule,
]);

const statuses = {
  all: 'All',
  active: 'Active',
  paused: 'On Hold',
  outOfStock: 'Out of Stock',
};

const statusFormatter: ValueFormatterFunc = ({ value }) =>
  statuses[value as keyof typeof statuses] ?? '';

@Component({
  selector: 'inventory-example',
  standalone: true,
  imports: [
    AgGridAngular,
    FormsModule,
    ProductCellRenderer,
    StatusCellRenderer,
    StockCellRenderer,
    PriceCellRenderer,
    ActionsCellRenderer,
  ],
  templateUrl: './inventory-example.component.html',
  styleUrl: './inventory-example.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class InventoryExample {
  @Input() gridTheme: string = 'ag-theme-quartz';
  @Input() isDarkMode: boolean = false;

  private gridApi!: GridApi;

  themeClass = `${this.gridTheme}${this.isDarkMode ? '-dark' : ''}`;
  theme: GridOptions['theme'] = 'legacy';

  rowData = getData();
  columnDefs = [
    {
      field: 'product',
      headerName: 'Album Name',
      cellRenderer: 'agGroupCellRenderer',
      headerClass: 'header-product',
      cellRendererParams: {
        innerRenderer: ProductCellRenderer,
      },
      minWidth: 300,
    },
    { field: 'artist' },
    { field: 'year', width: 150, headerClass: 'header-sku' },
    {
      field: 'status',
      valueFormatter: statusFormatter,
      cellRenderer: StatusCellRenderer,
      filter: true,
      filterParams: {
        valueFormatter: statusFormatter,
      },
      headerClass: 'header-status',
    },

    {
      field: 'inventory',
      cellRenderer: StockCellRenderer,
      headerClass: 'header-inventory',
      sortable: false,
    },
    {
      field: 'incoming',
      cellEditorParams: {
        precision: 0,
        step: 1,
        showStepperButtons: true,
      },
      editable: true,
    },
    {
      field: 'price',
      width: 120,
      headerClass: 'header-price',
      cellRenderer: PriceCellRenderer,
    },
    { field: 'sold', headerClass: 'header-calendar' },
    {
      headerName: 'Est. Profit',
      colId: 'profit',
      headerClass: 'header-percentage',
      cellDataType: 'number',
      valueGetter: ({ data: { price, sold } }: ValueGetterParams) =>
        (price * sold) / 10,
      valueFormatter: ({ value }: ValueFormatterParams) => `£${value}`,
      width: 150,
    },
    { field: 'actions', cellRenderer: ActionsCellRenderer, minWidth: 194 },
  ];
  defaultColDef: ColDef = {
    resizable: false,
  };
  autoSizeStrategy: SizeColumnsToFitGridStrategy = {
    type: 'fitGridWidth',
  };
  detailCellRendererParams = {
    detailGridOptions: {
      columnDefs: [
        { field: 'title', flex: 1.5 },
        { field: 'available', maxWidth: 120 },
        { field: 'format', flex: 2 },
        { field: 'label', flex: 1 },
        { field: 'country', flex: 0.66 },
        {
          field: 'cat',
          headerName: 'Cat#',
          type: 'rightAligned',
          flex: 0.66,
        },
        { field: 'year', type: 'rightAligned', maxWidth: 80 },
      ],
      headerHeight: 38,
    },
    getDetailRowData: ({
      successCallback,
      data: { variantDetails },
    }: GetDetailRowDataParams) => successCallback(variantDetails),
  };
  rowHeight = 80;
  paginationPageSizeSelector = [5, 10, 20];
  pagination = true;
  paginationPageSize = 10;
  masterDetail = true;
  detailRowAutoHeight = true;

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
  }

  statusEntries = Object.entries(statuses);
  activeTab = 'all';
  quickFilterText = '';

  handleTabClick(status: string) {
    this.gridApi.setColumnFilterModel(
      'status',
      status === 'all' ? null : { values: [status] }
    );
    this.gridApi.onFilterChanged();
    this.activeTab = status;
  }
}
