import {
  AllCommunityModule,
  type ColDef,
  createGrid,
  type GetDetailRowDataParams,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueFormatterParams,
  type ValueGetterParams,
  type ICellRendererParams,
  type GridApi,
  type SizeColumnsToFitGridStrategy,
} from "ag-grid-community";
import {
  ExcelExportModule,
  MasterDetailModule,
  MultiFilterModule,
  SetFilterModule,
} from "ag-grid-enterprise";
import "./styles.css";
import { getData } from "./data";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ExcelExportModule,
  SetFilterModule,
  MultiFilterModule,
  MasterDetailModule,
]);

const paginationPageSizeSelector = [5, 10, 20];
const statuses = {
  all: "All",
  active: "Active",
  paused: "On Hold",
  outOfStock: "Out of Stock",
};
const statusFormatter: ValueFormatterFunc = ({ value }) =>
  statuses[value as keyof typeof statuses] ?? "";

const actionsCellRenderer = (params: ICellRendererParams) => {
  const api = params.api as GridApi;
  const node = params.node;

  const container = document.createElement("div");
  container.className = "buttonCell";

  const removeButton = document.createElement("button");
  removeButton.className = "removeButton";
  const removeIcon = document.createElement("img");
  removeIcon.src = "/example/inventory/delete.svg";
  removeIcon.alt = "delete";
  removeButton.append(removeIcon);
  removeButton.addEventListener("click", () => {
    if (node?.data) {
      api.applyTransaction({ remove: [node.data] });
    }
  });

  const stopButton = document.createElement("button");
  stopButton.className = "buttonStopSelling";
  stopButton.textContent = "Hold Selling";
  stopButton.addEventListener("click", () => {
    if (!node?.data) {
      return;
    }
    const rowData = node.data;
    const isPaused = rowData.status === "paused";
    const isOutOfStock = rowData.available <= 0;
    rowData.status = !isPaused
      ? "paused"
      : !isOutOfStock
        ? "active"
        : "outOfStock";
    api.applyTransaction({ update: [rowData] });
  });

  container.append(removeButton, stopButton);
  return container;
};

const priceCellRenderer = (params: ICellRendererParams) => {
  const container = document.createElement("div");
  container.className = "price";

  const price = document.createElement("span");
  price.className = "priceAmount";
  price.textContent = `£${params.value ?? ""}`;

  const increase = document.createElement("span");
  increase.className = "increase";
  increase.textContent = `${params.data?.priceIncrease ?? ""}% increase`;

  container.append(price, increase);
  return container;
};

const productCellRenderer = (params: ICellRendererParams) => {
  const container = document.createElement("div");
  container.className = "productCell";

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "image";
  const image = document.createElement("img");
  image.src = `/example/inventory/${params.data?.image ?? ""}`;
  image.alt = params.data?.image ?? "";
  imageWrapper.append(image);

  const textWrapper = document.createElement("div");
  const title = document.createElement("div");
  title.textContent = params.value ?? "";
  const category = document.createElement("div");
  category.className = "stockCell";
  category.textContent = params.data?.category ?? "";
  textWrapper.append(title, category);

  container.append(imageWrapper, textWrapper);
  return container;
};

const statusCellRenderer = (params: ICellRendererParams) => {
  const value = params.value ?? "";
  const container = document.createElement("div");
  container.className = `tag ${value}Tag`.trim();

  const circle = document.createElement("div");
  circle.className = `circle ${value}Circle`.trim();
  const label = document.createElement("span");
  label.textContent = params.valueFormatted ?? value;

  container.append(circle, label);
  return container;
};

const stockCellRenderer = (params: ICellRendererParams) => {
  const container = document.createElement("div");
  container.className = "stock";

  const available = document.createElement("span");
  available.textContent = String(params.data?.available ?? 0);

  const stockText = document.createElement("span");
  stockText.className = "stockText";
  stockText.textContent = "Stock /";

  const variantsText = document.createElement("span");
  variantsText.className = "variantsText";
  variantsText.textContent = `${params.data?.variants ?? 0} Variants`;

  container.append(available, stockText, variantsText);
  return container;
};

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error("App container not found");
}

const wrapper = document.createElement("div");
wrapper.className = "wrapper";
const container = document.createElement("div");
container.className = "container";
wrapper.append(container);
app.append(wrapper);

const header = document.createElement("div");
header.className = "exampleHeader";
container.append(header);

const tabs = document.createElement("div");
tabs.className = "tabs";
header.append(tabs);

let activeTab = "all";
const updateActiveTab = (tab: string) => {
  activeTab = tab;
  Array.from(tabs.querySelectorAll("button")).forEach((button) => {
    button.classList.toggle("active", button.dataset.status === activeTab);
  });
};

Object.entries(statuses).forEach(([key, label]) => {
  const button = document.createElement("button");
  button.className = "tabButton";
  button.textContent = label;
  button.dataset.status = key;
  button.addEventListener("click", () => {
    updateActiveTab(key);
    if (!gridApi) {
      return;
    }
    gridApi
      .setColumnFilterModel("status", key === "all" ? null : { values: [key] })
      .then(() => gridApi.onFilterChanged());
  });
  tabs.append(button);
});
updateActiveTab(activeTab);

const inputWrapper = document.createElement("div");
inputWrapper.className = "inputWrapper";
inputWrapper.innerHTML = `
  <svg class="searchIcon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5014 7.00039C11.5014 7.59133 11.385 8.1765 11.1588 8.72246C10.9327 9.26843 10.6012 9.7645 10.1833 10.1824C9.76548 10.6002 9.2694 10.9317 8.72344 11.1578C8.17747 11.384 7.59231 11.5004 7.00136 11.5004C6.41041 11.5004 5.82525 11.384 5.27929 11.1578C4.73332 10.9317 4.23725 10.6002 3.81938 10.1824C3.40152 9.7645 3.07005 9.26843 2.8439 8.72246C2.61776 8.1765 2.50136 7.59133 2.50136 7.00039C2.50136 5.80691 2.97547 4.66232 3.81938 3.81841C4.6633 2.97449 5.80789 2.50039 7.00136 2.50039C8.19484 2.50039 9.33943 2.97449 10.1833 3.81841C11.0273 4.66232 11.5014 5.80691 11.5014 7.00039ZM10.6814 11.7404C9.47574 12.6764 7.95873 13.1177 6.43916 12.9745C4.91959 12.8314 3.51171 12.1145 2.50211 10.9698C1.49252 9.8251 0.957113 8.33868 1.0049 6.81314C1.05268 5.28759 1.68006 3.83759 2.75932 2.75834C3.83857 1.67908 5.28856 1.0517 6.81411 1.00392C8.33966 0.956136 9.82608 1.49154 10.9708 2.50114C12.1154 3.51073 12.8323 4.91862 12.9755 6.43819C13.1187 7.95775 12.6773 9.47476 11.7414 10.6804L14.5314 13.4704C14.605 13.539 14.6642 13.6218 14.7051 13.7138C14.7461 13.8058 14.7682 13.9052 14.77 14.0059C14.7717 14.1066 14.7532 14.2066 14.7155 14.3C14.6778 14.3934 14.6216 14.4782 14.5504 14.5494C14.4792 14.6206 14.3943 14.6768 14.301 14.7145C14.2076 14.7522 14.1075 14.7708 14.0068 14.769C13.9061 14.7672 13.8068 14.7452 13.7148 14.7042C13.6228 14.6632 13.54 14.6041 13.4714 14.5304L10.6814 11.7404Z" fill="currentColor"/>
  </svg>
`;
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.id = "filter-text-box";
searchInput.placeholder = "Search product...";
inputWrapper.append(searchInput);
header.append(inputWrapper);

const gridWrapper = document.createElement("div");
gridWrapper.className = "grid ag-theme-quartz";
container.append(gridWrapper);

const colDefs: ColDef[] = [
  {
    field: "product",
    headerName: "Album Name",
    cellRenderer: "agGroupCellRenderer",
    headerClass: "header-product",
    cellRendererParams: {
      innerRenderer: productCellRenderer,
    },
    minWidth: 300,
  },
  { field: "artist" },
  { field: "year", width: 150, headerClass: "header-sku" },
  {
    field: "status",
    valueFormatter: statusFormatter,
    cellRenderer: statusCellRenderer,
    minWidth: 140,
    filter: true,
    filterParams: {
      valueFormatter: statusFormatter,
    },
    headerClass: "header-status",
  },
  {
    field: "inventory",
    cellRenderer: stockCellRenderer,
    headerClass: "header-inventory",
    sortable: false,
  },
  {
    field: "incoming",
    cellEditorParams: {
      precision: 0,
      step: 1,
      showStepperButtons: true,
    },
    editable: true,
  },
  {
    field: "price",
    width: 120,
    headerClass: "header-price",
    cellRenderer: priceCellRenderer,
  },
  { field: "sold", headerClass: "header-calendar" },
  {
    headerName: "Est. Profit",
    colId: "profit",
    headerClass: "header-percentage",
    cellDataType: "number",
    valueGetter: ({ data: { price, sold } }: ValueGetterParams) =>
      (price * sold) / 10,
    valueFormatter: ({ value }: ValueFormatterParams) => `£${value}`,
    width: 150,
  },
  { field: "actions", cellRenderer: actionsCellRenderer, minWidth: 194 },
];

const autoSizeStrategy: SizeColumnsToFitGridStrategy = { type: "fitGridWidth" };

const gridApi = createGrid(gridWrapper, {
  columnDefs: colDefs,
  rowData: getData(),
  rowHeight: 80,
  defaultColDef: { resizable: false },
  autoSizeStrategy,
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: paginationPageSizeSelector,
  masterDetail: true,
  detailRowAutoHeight: true,
  detailCellRendererParams: {
    detailGridOptions: {
      columnDefs: [
        { field: "title", flex: 1.5 },
        { field: "available", maxWidth: 120 },
        { field: "format", flex: 2 },
        { field: "label", flex: 1 },
        { field: "country", flex: 0.66 },
        { field: "cat", headerName: "Cat#", type: "rightAligned", flex: 0.66 },
        { field: "year", type: "rightAligned", maxWidth: 80 },
      ],
      headerHeight: 38,
    },
    getDetailRowData: ({
      successCallback,
      data: { variantDetails },
    }: GetDetailRowDataParams) => successCallback(variantDetails),
  },
});

searchInput.addEventListener("input", () => {
  gridApi.setGridOption("quickFilterText", searchInput.value);
});
