import type { AgChartThemeOverrides } from "ag-charts-community";

const defaultChartThemes = [
  "ag-default",
  "ag-material",
  "ag-sheets",
  "ag-polychroma",
  "ag-vivid",
];
const defaultChartThemesDark = defaultChartThemes.map((theme) => `${theme}-dark`);

export const getDefaultChartThemes = (isDarkMode: boolean): string[] => {
  return isDarkMode ? defaultChartThemesDark : defaultChartThemes;
};

const axisLabelFormatter = ({ value }: { value: number | string }) => {
  if (isNaN(Number(value))) {
    return value;
  }

  const numericValue = Number(value);
  const absolute = Math.abs(numericValue);
  let standardized = "";

  if (absolute < 1e3) {
    standardized = absolute.toString();
  }
  if (absolute >= 1e3 && absolute < 1e6) {
    standardized = `$${+(absolute / 1e3).toFixed(1)}K`;
  }
  if (absolute >= 1e6 && absolute < 1e9) {
    standardized = `$${+(absolute / 1e6).toFixed(1)}M`;
  }
  if (absolute >= 1e9 && absolute < 1e12) {
    standardized = `$${+(absolute / 1e9).toFixed(1)}B`;
  }
  if (absolute >= 1e12) {
    standardized = `$${+(absolute / 1e12).toFixed(1)}T`;
  }

  return numericValue < 0 ? `-${standardized}` : standardized;
};

const hierarchicalSeriesThemeOverrides = {
  gradientLegend: {
    scale: {
      label: {
        formatter: ({ value }: { value: unknown }) => {
          const num = Number(value);
          return Number.isNaN(num) ? value : `$${num.toLocaleString()}`;
        },
      },
    },
  },
};

export const chartThemeOverrides: AgChartThemeOverrides = {
  common: {
    axes: {
      number: {
        label: {
          formatter: axisLabelFormatter,
        },
      },
      "angle-number": {
        label: {
          formatter: axisLabelFormatter,
        },
      },
      "radius-number": {
        label: {
          formatter: axisLabelFormatter,
        },
      },
    },
  },
  treemap: hierarchicalSeriesThemeOverrides,
  sunburst: hierarchicalSeriesThemeOverrides,
};
