import {
  AllCommunityModule,
  type ColDef,
  createGrid,
  type GetDataPath,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueFormatterParams,
  type ICellRendererParams,
} from "ag-grid-community";
import {
  ExcelExportModule,
  MasterDetailModule,
  RichSelectModule,
  RowGroupingModule,
  SetFilterModule,
  StatusBarModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import "./styles.css";
import { getData } from "./data";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ExcelExportModule,
  MasterDetailModule,
  RowGroupingModule,
  RichSelectModule,
  SetFilterModule,
  StatusBarModule,
  TreeDataModule,
]);

const employmentType = ["Permanent", "Contract"];
const paymentMethod = ["Cash", "Check", "Bank Transfer"];
const paymentStatus = ["Paid", "Pending"];
const departments = {
  executiveManagement: "Executive Management",
  legal: "Legal",
  design: "Design",
  engineering: "Engineering",
  product: "Product",
  customerSupport: "Customer Support",
};
const departmentFormatter: ValueFormatterFunc = ({ value }) =>
  departments[value as keyof typeof departments] ?? "";

const contactCellRenderer = (params: ICellRendererParams) => {
  const name = params.data?.orgHierarchy?.at(-1) ?? "";
  const emailName = name.toLowerCase().replace(" ", ".");

  const container = document.createElement("div");
  container.className = "contact-cell";

  const iconContainer = document.createElement("div");
  iconContainer.className = "iconContainer";

  const linkedinButton = document.createElement("button");
  const linkedinLink = document.createElement("a");
  linkedinLink.href = "https://www.linkedin.com/company/ag-grid/";
  linkedinLink.target = "_blank";
  linkedinLink.rel = "noopener noreferrer";
  linkedinLink.className = "iconLink";
  const linkedinIcon = document.createElement("img");
  linkedinIcon.className = "icon";
  linkedinIcon.src = "/example/hr/linkedin.svg";
  linkedinIcon.alt = "linkedin";
  linkedinLink.append(linkedinIcon);
  linkedinButton.append(linkedinLink);

  const emailButton = document.createElement("button");
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${emailName}@company.com`;
  emailLink.className = "iconLink";
  const emailIcon = document.createElement("img");
  emailIcon.className = "icon";
  emailIcon.src = "/example/hr/email.svg";
  emailIcon.alt = "email";
  emailLink.append(emailIcon);
  emailButton.append(emailLink);

  iconContainer.append(linkedinButton, emailButton);
  container.append(iconContainer);

  return container;
};

const employeeCellRenderer = (params: ICellRendererParams) => {
  const value = params.value ?? "";
  const jobTitle = params.data?.jobTitle ?? "";
  const image = params.data?.image ?? "";

  const container = document.createElement("div");
  container.className = "employeeCell";

  const data = document.createElement("div");
  data.className = "employeeData";
  const name = document.createElement("span");
  name.textContent = value;
  const title = document.createElement("span");
  title.className = "description";
  title.textContent = jobTitle;
  data.append(name, title);

  const img = document.createElement("img");
  img.className = "image";
  img.src = `/example/hr/${image}.webp`;
  img.alt = value.toLowerCase();

  container.append(data, img);
  return container;
};

const flagCellRenderer = (params: ICellRendererParams) => {
  const value = params.value ?? "";
  const flag = params.data?.flag ?? "";

  const container = document.createElement("div");
  container.className = "flagCell";

  const data = document.createElement("div");
  data.className = "employeeData";
  const name = document.createElement("span");
  name.textContent = value;
  data.append(name);

  const img = document.createElement("img");
  img.className = "flagImage";
  img.src = `/example/hr/${flag}.svg`;
  img.alt = value.toLowerCase();

  container.append(data, img);
  return container;
};

const statusCellRenderer = (params: ICellRendererParams) => {
  const value = params.value ?? "";
  const container = document.createElement("div");
  container.className = `tag ${value}Tag`.trim();

  if (value === "paid") {
    const tick = document.createElement("img");
    tick.className = "tick";
    tick.src = "/example/hr/tick.svg";
    tick.alt = "tick";
    container.append(tick);
  }

  const label = document.createElement("span");
  label.textContent = value;
  container.append(label);
  return container;
};

const tagCellRenderer = (params: ICellRendererParams) => {
  const value = params.value ?? "";
  const valueFormatted = params.valueFormatted ?? value;

  const container = document.createElement("div");
  container.className = `tag ${value}Tag`.trim();

  const circle = document.createElement("div");
  circle.className = `circle ${value}Circle`.trim();

  const label = document.createElement("span");
  label.textContent = valueFormatted;

  container.append(circle, label);
  return container;
};

const app = document.querySelector<HTMLElement>("#app");
if (!app) {
  throw new Error("App container not found");
}

const gridTheme = "ag-theme-quartz";
const isDarkMode = false;
const themeClass = isDarkMode ? `${gridTheme}-dark` : gridTheme;

const wrapper = document.createElement("div");
wrapper.className = "wrapper";
const container = document.createElement("div");
container.className = "container";
const grid = document.createElement("div");
grid.className = `grid ${themeClass}`;

container.append(grid);
wrapper.append(container);
app.append(wrapper);

const colDefs: ColDef[] = [
  {
    headerName: "ID",
    field: "employeeId",
    width: 120,
  },
  {
    field: "department",
    width: 250,
    minWidth: 250,
    flex: 1,
    valueFormatter: departmentFormatter,
    cellRenderer: tagCellRenderer,
  },
  {
    field: "employmentType",
    editable: true,
    width: 180,
    minWidth: 180,
    flex: 1,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: employmentType,
    },
  },
  {
    field: "location",
    width: 200,
    minWidth: 200,
    flex: 1,
    cellRenderer: flagCellRenderer,
    editable: true,
  },
  {
    field: "joinDate",
    editable: true,
    width: 120,
  },
  {
    headerName: "Salary",
    field: "basicMonthlySalary",
    valueFormatter: ({ value }: ValueFormatterParams) =>
      value == null ? "" : `$${Math.round(value).toLocaleString()}`,
  },
  {
    field: "paymentMethod",
    editable: true,
    width: 180,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: paymentMethod,
    },
  },
  {
    headerName: "Status",
    field: "paymentStatus",
    editable: true,
    width: 100,
    cellRenderer: statusCellRenderer,
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: paymentStatus,
    },
  },
  {
    field: "contact",
    pinned: "right",
    cellRenderer: contactCellRenderer,
    width: 120,
  },
];

const autoGroupColumnDef: ColDef = {
  headerName: "Employee",
  width: 330,
  pinned: "left",
  sort: "asc",
  cellRenderer: "agGroupCellRenderer",
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: employeeCellRenderer,
  },
};

const getDataPath: GetDataPath = (data) => data.orgHierarchy;

createGrid(grid, {
  columnDefs: colDefs,
  rowData: getData(),
  rowHeight: 62,
  groupDefaultExpanded: -1,
  getDataPath,
  treeData: true,
  autoGroupColumnDef,
});
