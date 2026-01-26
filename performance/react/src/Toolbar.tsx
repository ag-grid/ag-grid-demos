import type { ChangeEvent, RefObject } from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";

import type { GridApi } from "ag-grid-community";

import styles from "./Toolbar.module.css";
import { createDataSizeValue } from "./utils";

const IS_SSR = typeof window === "undefined";

interface ToolbarProps {
  gridRef: RefObject<{ api: GridApi }>;
  dataSize: string | undefined;
  setDataSize: (size: string) => void;
  rowCols: [number, number][];
  gridTheme: string;
  setGridTheme: (theme: string) => void;
  setCountryColumnPopupEditor: (theme: string, api: GridApi) => void;
}

const options: Record<string, string> = {
  quartz: "Quartz",
  balham: "Balham",
  material: "Material",
  alpine: "Alpine",
};

export const Toolbar = ({
  gridRef,
  dataSize,
  setDataSize,
  rowCols,
  gridTheme,
  setGridTheme,
  setCountryColumnPopupEditor,
}: ToolbarProps) => {
  const dataSizeOptions = useMemo(
    () =>
      rowCols.map(([rows, cols]) => ({
        label: `${rows.toLocaleString()} Rows, ${cols.toLocaleString()} Cols`,
        value: createDataSizeValue(rows, cols),
      })),
    [rowCols]
  );

  const themeOptions = useMemo(
    () =>
      Object.entries(options).map(([value, label]) => ({
        value,
        label,
      })),
    []
  );

  const dataSizeValue = dataSize ?? dataSizeOptions[0]?.value ?? "";

  const handleDataSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDataSize(event.target.value);
  };

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (!gridRef.current?.api) {
      return;
    }
    const newTheme = event.target.value || "quartz";
    setCountryColumnPopupEditor(newTheme, gridRef.current.api);
    setGridTheme(newTheme);

    if (!IS_SSR) {
      let url = window.location.href;
      if (url.includes("?theme=")) {
        url = url.replace(/\?theme=[\w:-]+/, `?theme=${newTheme}`);
      } else {
        const separator = url.includes("?") ? "&" : "?";
        url += `${separator}theme=${newTheme}`;
      }
      history.replaceState({}, "", url);
    }
  };

  const [quickFilterText, setQuickFilterText] = useState("");
  const deferredQuickFilterText = useDeferredValue(quickFilterText);

  useEffect(() => {
    if (!gridRef.current?.api) {
      return;
    }
    gridRef.current.api.setGridOption("quickFilterText", deferredQuickFilterText);
  }, [deferredQuickFilterText, gridRef]);

  const onFilterChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setQuickFilterText(event.target.value);
  };

  return (
    <div className={styles.toolbar}>
      <div className={styles.controls}>
        <div className={styles.group}>
          <label className={styles.label} htmlFor="data-size">
            Data Size
          </label>
          <select
            id="data-size"
            className={styles.select}
            value={dataSizeValue}
            onChange={handleDataSizeChange}
          >
            {dataSizeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.group}>
          <label className={styles.label} htmlFor="theme-select">
            Theme
          </label>
          <select
            id="theme-select"
            className={styles.select}
            value={gridTheme}
            onChange={handleThemeChange}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={`${styles.group} ${styles.searchGroup}`}>
          <label className={styles.label} htmlFor="global-filter">
            Filter
          </label>
          <input
            id="global-filter"
            className={styles.input}
            placeholder="Filter any column..."
            type="text"
            onInput={onFilterChanged}
          />
        </div>
      </div>
    </div>
  );
};
