import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  signal,
} from "@angular/core";
import { AgGridAngular } from "ag-grid-angular";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import type {
  ColDef,
  ColGroupDef,
  CsvExportParams,
  ExcelExportParams,
  GridApi,
  GridOptions,
  GridReadyEvent,
  SideBarDef,
  Theme,
} from "ag-grid-community";
import {
  AllCommunityModule,
  themeAlpine,
  themeBalham,
  themeMaterial,
  themeQuartz,
} from "ag-grid-community";
import {
  CellSelectionModule,
  ClipboardModule,
  ColumnMenuModule,
  ColumnsToolPanelModule,
  ContextMenuModule,
  ExcelExportModule,
  IntegratedChartsModule,
  MasterDetailModule,
  MultiFilterModule,
  NewFiltersToolPanelModule,
  PivotModule,
  RichSelectModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  RowNumbersModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
} from "ag-grid-enterprise";
import {
  chartThemeOverrides,
  getDefaultChartThemes,
} from "../config/chartOverrides";
import {
  autoGroupColDef,
  columnTypes,
  dataTypeDefinitions,
  largeColCount,
  largeDefaultCols,
  smallColCount,
  smallDefaultCols,
} from "../config/colDefs";
import { excelStyles } from "../config/excelStyles";
import { COUNTRY_CODES, colNames, countries, createRowItem } from "../data";
import { createDataSizeValue } from "../utils";

const themeMap: Record<string, Theme> = {
  alpine: themeAlpine,
  balham: themeBalham,
  material: themeMaterial,
  quartz: themeQuartz,
};

const modules = [
  AllCommunityModule,
  ClipboardModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  NewFiltersToolPanelModule,
  MasterDetailModule,
  ColumnMenuModule,
  ContextMenuModule,
  MultiFilterModule,
  CellSelectionModule,
  RichSelectModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
  PivotModule,
  RowNumbersModule,
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
];

const staticGridOptions: GridOptions = {
  statusBar: {
    statusPanels: [
      {
        statusPanel: "agTotalAndFilteredRowCountComponent",
        key: "totalAndFilter",
        align: "left",
      },
      { statusPanel: "agSelectedRowCountComponent", align: "left" },
      { statusPanel: "agAggregationComponent", align: "right" },
    ],
  },
  cellSelection: {
    enableHeaderHighlight: true,
    handle: {
      mode: "fill",
    },
  },
  rowSelection: {
    mode: "multiRow",
  },
  initialGroupOrderComparator: ({
    nodeA,
    nodeB,
  }: {
    nodeA: any;
    nodeB: any;
  }) => {
    const aKey = nodeA.key || "";
    const bKey = nodeB.key || "";
    if (aKey < bKey) {
      return -1;
    }
    if (aKey > bKey) {
      return 1;
    }
    return 0;
  },
  enableRtl: /[?&]rtl=true/.test(window.location.search),
  pivotPanelShow: "always",
  enableCharts: true,
  undoRedoCellEditing: true,
  undoRedoCellEditingLimit: 50,
  rowNumbers: true,
  autoGroupColumnDef: autoGroupColDef,
  chartThemeOverrides: chartThemeOverrides,
  excelStyles: excelStyles,
  enableFilterHandlers: true,
  rowDragManaged: true,
  rowDragMultiRow: true,
  loadingOverlayComponentParams: {
    loadingMessage: "Generating rows....",
  },
};

@Component({
  standalone: true,
  selector: "app-root",
  imports: [CommonModule, AgGridAngular],
  template: `
    <div class="exampleWrapper">
      <div class="toolbar">
        <div class="controls">
          <div class="group">
            <label class="label" for="data-size">Data Size</label>
            <select
              id="data-size"
              class="select"
              [value]="dataSize() ?? ''"
              (change)="handleDataSizeChange($event)"
            >
              <option
                *ngFor="let option of dataSizeOptions()"
                [value]="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="group">
            <label class="label" for="theme-select">Theme</label>
            <select
              id="theme-select"
              class="select"
              [value]="gridThemeStr()"
              (change)="handleThemeChange($event)"
            >
              <option
                *ngFor="let option of themeOptions"
                [value]="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="group searchGroup">
            <label class="label" for="global-filter">Filter</label>
            <input
              id="global-filter"
              class="input"
              placeholder="Filter any column..."
              type="text"
              (input)="onFilterChanged($event)"
            />
          </div>
        </div>
      </div>
      <section class="gridWrapper">
        <div class="gridSurface" [ngClass]="themeClass()">
          <ag-grid-angular
            #grid
            class="grid-root"
            [modules]="modules"
            [gridOptions]="gridOptions"
            [theme]="gridTheme()"
            [chartThemes]="chartThemes()"
            [columnDefs]="columnDefs() ?? undefined"
            [rowData]="rowData() ?? undefined"
            [loading]="isLoading()"
            [defaultColDef]="defaultColDef()"
            [sideBar]="sideBar()"
            [columnTypes]="columnTypes"
            [dataTypeDefinitions]="dataTypeDefinitions"
            [rowGroupPanelShow]="rowGroupPanelShow()"
            [defaultCsvExportParams]="defaultCsvExportParams()"
            [defaultExcelExportParams]="defaultExcelExportParams()"
            (gridReady)="onGridReady($event)"
          >
          </ag-grid-angular>
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("grid") private grid?: AgGridAngular;

  modules = modules;
  gridOptions = staticGridOptions;
  columnTypes = columnTypes;
  dataTypeDefinitions = dataTypeDefinitions;

  darkMode = false;
  gridThemeStr = signal(
    new URLSearchParams(window.location.search).get("theme") ?? "quartz",
  );
  isSmall = signal(
    document.documentElement.clientHeight <= 415 ||
      document.documentElement.clientWidth < 768,
  );

  base64Flags = signal<Record<string, string> | null>(null);
  defaultCols = signal<(ColDef | ColGroupDef)[] | null>(null);
  defaultColCount = signal(0);
  columnDefs = signal<(ColDef | ColGroupDef)[] | null>(null);
  rowData = signal<unknown[] | null>(null);
  isLoading = signal(true);
  rowCols = signal<[number, number][]>([]);
  dataSize = signal<string | null>(null);

  private loadInstance = 0;
  private dataIntervalId: number | null = null;
  private dataTimeoutId: number | null = null;

  themeOptions = [
    { value: "quartz", label: "Quartz" },
    { value: "balham", label: "Balham" },
    { value: "material", label: "Material" },
    { value: "alpine", label: "Alpine" },
  ];

  dataSizeOptions = signal<{ label: string; value: string }[]>([]);

  gridTheme = computed<Theme>(
    () => themeMap[this.gridThemeStr()] || themeQuartz,
  );

  themeClass = computed(() =>
    this.darkMode
      ? `ag-theme-${this.gridThemeStr()}-dark`
      : `ag-theme-${this.gridThemeStr()}`,
  );

  chartThemes = computed(() => getDefaultChartThemes(this.darkMode));

  rowGroupPanelShow = computed<"always" | undefined>(() =>
    this.isSmall() ? undefined : "always",
  );

  defaultColDef = computed<ColDef>(() => ({
    minWidth: 50,
    editable: true,
    filter: true,
    floatingFilter: !this.isSmall(),
    enableCellChangeFlash: true,
  }));

  sideBar = computed<SideBarDef>(() => ({
    toolPanels: ["columns", "filters-new"],
    position: "right",
    defaultToolPanel: "columns",
    hiddenByDefault: this.isSmall(),
  }));

  defaultExcelExportParams = computed<ExcelExportParams>(() => ({
    headerRowHeight: 40,
    rowHeight: 30,
    fontSize: 14,
    addImageToCell: (rowIndex, column, value) => {
      const flags = this.base64Flags();
      if (column.getColId() === "country" && flags) {
        return {
          image: {
            id: value,
            base64: flags[COUNTRY_CODES[value]],
            imageType: "png",
            width: 20,
            height: 12,
            position: {
              offsetX: 17,
              offsetY: 14,
            },
          },
          value,
        };
      }
      return undefined;
    },
  }));

  defaultCsvExportParams = computed<CsvExportParams>(() => ({}));

  ngOnInit() {
    const isSmall = this.isSmall();
    this.defaultCols.set(isSmall ? smallDefaultCols : largeDefaultCols);
    this.defaultColCount.set(isSmall ? smallColCount : largeColCount);

    const newRowsCols: [number, number][] = [
      [100, this.defaultColCount()],
      [1000, this.defaultColCount()],
    ];

    if (!isSmall) {
      newRowsCols.push(
        [10000, 100],
        [50000, this.defaultColCount()],
        [100000, this.defaultColCount()],
      );
    }
    this.rowCols.set(newRowsCols);
    const dataSizeOptions = newRowsCols.map(([rows, cols]) => ({
      label: `${rows.toLocaleString()} Rows, ${cols.toLocaleString()} Cols`,
      value: createDataSizeValue(rows, cols),
    }));
    this.dataSizeOptions.set(dataSizeOptions);
    const initialSize = dataSizeOptions[0]?.value ?? null;
    this.dataSize.set(initialSize);
    if (initialSize) {
      this.scheduleDataLoad(initialSize);
    }

    this.loadFlags();
  }

  ngOnDestroy() {
    if (this.dataIntervalId) {
      window.clearInterval(this.dataIntervalId);
      this.dataIntervalId = null;
    }
    if (this.dataTimeoutId) {
      window.clearTimeout(this.dataTimeoutId);
      this.dataTimeoutId = null;
    }
  }

  onGridReady(event: GridReadyEvent) {
    if (document.documentElement.clientWidth <= 1024) {
      event.api.closeToolPanel();
    }
  }

  handleDataSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;
    this.dataSize.set(newValue);
    this.scheduleDataLoad(newValue);
  }

  handleThemeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newTheme = target.value || "quartz";
    const gridApi = this.grid?.api;
    if (gridApi) {
      this.setCountryColumnPopupEditor(newTheme, gridApi);
    }
    this.gridThemeStr.set(newTheme);

    let url = window.location.href;
    if (url.includes("?theme=")) {
      url = url.replace(/\?theme=[\w:-]+/, `?theme=${newTheme}`);
    } else {
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}theme=${newTheme}`;
    }
    history.replaceState({}, "", url);
  }

  onFilterChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const gridApi = this.grid?.api;
    if (!gridApi) {
      return;
    }
    gridApi.setGridOption("quickFilterText", target.value);
  }

  private scheduleDataLoad(size: string) {
    if (this.dataTimeoutId) {
      window.clearTimeout(this.dataTimeoutId);
    }
    this.isLoading.set(true);
    this.dataTimeoutId = window.setTimeout(() => {
      this.createData(size);
    }, 10);
  }

  private createData(newDataSize: string) {
    this.loadInstance += 1;
    const loadInstanceCopy = this.loadInstance;
    const startTime = Date.now();

    const colCount = parseInt(newDataSize?.split("x")[1] ?? "0", 10);
    const rowCount = parseFloat(newDataSize?.split("x")[0] ?? "0");
    const colDefs = this.createCols(colCount);

    let row = 0;
    const data: unknown[] = [];
    const loopCount = rowCount > 10000 ? 10000 : 1000;

    if (this.dataIntervalId) {
      window.clearInterval(this.dataIntervalId);
    }
    this.dataIntervalId = window.setInterval(() => {
      if (loadInstanceCopy !== this.loadInstance) {
        if (this.dataIntervalId) {
          window.clearInterval(this.dataIntervalId);
          this.dataIntervalId = null;
        }
        return;
      }

      for (let i = 0; i < loopCount; i += 1) {
        if (row < rowCount) {
          const rowItem = createRowItem(
            row,
            colCount,
            this.defaultCols()?.length ?? 0,
            this.defaultColCount(),
          );
          data.push(rowItem);
          row += 1;
        } else {
          break;
        }
      }

      if (row >= rowCount) {
        const elapsedTime = Date.now() - startTime;
        const minDisplayTime = 500;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        window.setTimeout(() => {
          this.isLoading.set(false);
          this.columnDefs.set(colDefs);
          this.rowData.set(data);
        }, remainingTime);

        if (this.dataIntervalId) {
          window.clearInterval(this.dataIntervalId);
          this.dataIntervalId = null;
        }
      }
    }, 0);
  }

  private createCols(colCount: number) {
    const columns = this.defaultCols()?.slice(0, colCount) ?? [];

    for (let col = this.defaultColCount(); col < colCount; col += 1) {
      const colName = colNames[col % colNames.length];
      const colDef = {
        headerName: colName,
        field: `col${col}`,
        width: 200,
        editable: true,
        filter: "agTextColumnFilter",
      };
      columns.push(colDef);
    }

    return columns;
  }

  private setCountryColumnPopupEditor(themeName: string, gridApi: GridApi) {
    const columnDefs = this.columnDefs();
    if (!gridApi || !columnDefs) {
      return;
    }
    const participantGroup = columnDefs.find(
      (group) => (group as ColGroupDef).headerName === "Participant",
    );
    if (!participantGroup) {
      return;
    }

    const countryColumn: ColDef = (
      participantGroup as ColGroupDef
    ).children.find(
      (column) => (column as ColDef).field === "country",
    ) as ColDef;
    countryColumn.cellEditorPopup = themeName.includes("material");

    this.columnDefs.set([...columnDefs]);
  }

  private loadFlags() {
    const flags: Record<string, string> = {};
    const promiseArray = countries.map(async (country) => {
      const countryCode = COUNTRY_CODES[country.country];
      const response = await fetch(
        `https://flagcdn.com/w20/${countryCode}.png`,
      );
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          flags[countryCode] = String(reader.result);
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });
    });

    Promise.all(promiseArray).then(() => {
      this.base64Flags.set(flags);
    });
  }
}
