<script setup lang="ts">
import { computed, defineComponent, h, ref } from "vue";
import { AgGridVue } from "ag-grid-vue3";
import {
  AllCommunityModule,
  ClientSideRowModelModule,
  type ColDef,
  type GetDataPath,
  ModuleRegistry,
  type ValueFormatterFunc,
  type ValueFormatterParams,
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
import { getData } from "./data";

ModuleRegistry.registerModules([
  AllCommunityModule,
  ClientSideRowModelModule,
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

const ContactCellRenderer = defineComponent({
  name: "ContactCellRenderer",
  props: { params: { type: Object, required: true } },
  setup(props) {
    const emailName = computed(() => {
      const name = (props.params as any).data?.orgHierarchy?.at(-1) ?? "";
      return name.toLowerCase().replace(" ", ".");
    });
    return () =>
      h("div", { class: "contact-cell" }, [
        h("div", { class: "iconContainer" }, [
          h("button", [
            h(
              "a",
              {
                href: "https://www.linkedin.com/company/ag-grid/",
                target: "_blank",
                rel: "noopener noreferrer",
                class: "iconLink",
              },
              [
                h("img", {
                  class: "icon",
                  src: "/example/hr/linkedin.svg",
                  alt: "linkedin",
                }),
              ],
            ),
          ]),
          h("button", [
            h(
              "a",
              {
                href: `mailto:${emailName.value}@company.com`,
                class: "iconLink",
              },
              [
                h("img", {
                  class: "icon",
                  src: "/example/hr/email.svg",
                  alt: "email",
                }),
              ],
            ),
          ]),
        ]),
      ]);
  },
});

const EmployeeCellRenderer = defineComponent({
  name: "EmployeeCellRenderer",
  props: { params: { type: Object, required: true } },
  setup(props) {
    const value = computed(() => (props.params as any).value ?? "");
    const jobTitle = computed(() => (props.params as any).data?.jobTitle ?? "");
    const image = computed(() => (props.params as any).data?.image ?? "");
    const imageUrl = computed(() =>
      image.value ? `/example/hr/${image.value}.webp` : "",
    );
    return () =>
      h("div", { class: "employeeCell" }, [
        h("div", { class: "employeeData" }, [
          h("span", value.value),
          h("span", { class: "description" }, jobTitle.value),
        ]),
        h("img", {
          class: "image",
          src: imageUrl.value,
          alt: value.value.toLowerCase(),
        }),
      ]);
  },
});

const FlagCellRenderer = defineComponent({
  name: "FlagCellRenderer",
  props: { params: { type: Object, required: true } },
  setup(props) {
    const value = computed(() => (props.params as any).value ?? "");
    const flag = computed(() => (props.params as any).data?.flag ?? "");
    const flagUrl = computed(() =>
      flag.value ? `/example/hr/${flag.value}.svg` : "",
    );
    return () =>
      h("div", { class: "flagCell" }, [
        h("div", { class: "employeeData" }, [h("span", value.value)]),
        h("img", {
          class: "flagImage",
          src: flagUrl.value,
          alt: value.value.toLowerCase(),
        }),
      ]);
  },
});

const StatusCellRenderer = defineComponent({
  name: "StatusCellRenderer",
  props: { params: { type: Object, required: true } },
  setup(props) {
    const value = computed(() => (props.params as any).value ?? "");
    return () =>
      h("div", { class: ["tag", `${value.value}Tag`] }, [
        value.value === "paid"
          ? h("img", {
              class: "tick",
              src: "/example/hr/tick.svg",
              alt: "tick",
            })
          : null,
        h("span", value.value),
      ]);
  },
});

const TagCellRenderer = defineComponent({
  name: "TagCellRenderer",
  props: { params: { type: Object, required: true } },
  setup(props) {
    const value = computed(() => (props.params as any).value ?? "");
    const valueFormatted = computed(
      () => (props.params as any).valueFormatted ?? "",
    );
    return () =>
      h("div", { class: ["tag", `${value.value}Tag`] }, [
        h("div", { class: ["circle", `${value.value}Circle`] }),
        h("span", valueFormatted.value || value.value),
      ]);
  },
});

const gridTheme = "ag-theme-quartz";
const isDarkMode = false;
const themeClass = computed(() =>
  isDarkMode ? `${gridTheme}-dark` : gridTheme,
);

const rowData = ref(getData());

const colDefs = computed<ColDef[]>(() => [
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
    cellRenderer: "tagCellRenderer",
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
    cellRenderer: "flagCellRenderer",
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
    cellRenderer: "statusCellRenderer",
    cellEditor: "agRichSelectCellEditor",
    cellEditorParams: {
      values: paymentStatus,
    },
  },
  {
    field: "contact",
    pinned: "right",
    cellRenderer: "contactCellRenderer",
    width: 120,
  },
]);

const getDataPath: GetDataPath = (data) => data.orgHierarchy;

const autoGroupColumnDef = computed<ColDef>(() => ({
  headerName: "Employee",
  width: 330,
  pinned: "left",
  sort: "asc",
  cellRenderer: "agGroupCellRenderer",
  cellRendererParams: {
    suppressCount: true,
    innerRenderer: "employeeCellRenderer",
  },
}));

const components = {
  contactCellRenderer: ContactCellRenderer,
  employeeCellRenderer: EmployeeCellRenderer,
  flagCellRenderer: FlagCellRenderer,
  statusCellRenderer: StatusCellRenderer,
  tagCellRenderer: TagCellRenderer,
};
</script>

<template>
  <div class="wrapper">
    <div class="container">
      <div class="grid" :class="themeClass">
        <AgGridVue
          class="grid-root"
          :columnDefs="colDefs"
          :rowData="rowData"
          :rowHeight="62"
          :groupDefaultExpanded="-1"
          :getDataPath="getDataPath"
          :treeData="true"
          :autoGroupColumnDef="autoGroupColumnDef"
          :components="components"
        />
      </div>
    </div>
  </div>
</template>
