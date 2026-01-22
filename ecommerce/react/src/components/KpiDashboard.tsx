import { useMemo } from "react";
import styles from "../EcommerceExample.module.css";

interface ProductData {
  productId: string;
  product: string;
  status: string;
  isDigital: boolean;
  price: number;
  cost: number;
  currency: string;
  stockByWarehouse: Record<string, number | undefined>;
  monthlySales: { month: string; sold: number }[];
}

interface KpiDashboardProps {
  data: ProductData[];
  onFilterLowStock?: () => void;
}

export function KpiDashboard({ data, onFilterLowStock }: KpiDashboardProps) {
  const metrics = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        totalRevenue: 0,
        avgMargin: 0,
        lowStockCount: 0,
        topPerformer: null as { name: string; revenue: number } | null,
        activeCount: 0,
        totalCount: 0,
      };
    }

    let totalRevenue = 0;
    let totalMarginWeighted = 0;
    let totalSalesForMargin = 0;
    let lowStockCount = 0;
    let activeCount = 0;
    let topPerformer: { name: string; revenue: number } | null = null;

    data.forEach((product) => {
      // Calculate revenue
      const productRevenue = product.monthlySales.reduce(
        (sum, m) => sum + m.sold * product.price,
        0
      );
      totalRevenue += productRevenue;

      // Track top performer
      if (!topPerformer || productRevenue > topPerformer.revenue) {
        topPerformer = { name: product.product, revenue: productRevenue };
      }

      // Calculate margin (weighted by revenue)
      const margin = ((product.price - product.cost) / product.price) * 100;
      totalMarginWeighted += margin * productRevenue;
      totalSalesForMargin += productRevenue;

      // Count low stock (any warehouse < 10)
      if (!product.isDigital) {
        const stocks = Object.values(product.stockByWarehouse).filter(
          (s): s is number => s !== undefined
        );
        if (stocks.length > 0 && stocks.some((s) => s < 10)) {
          lowStockCount++;
        }
      }

      // Count active
      if (product.status === "active") {
        activeCount++;
      }
    });

    const avgMargin =
      totalSalesForMargin > 0 ? totalMarginWeighted / totalSalesForMargin : 0;

    return {
      totalRevenue,
      avgMargin,
      lowStockCount,
      topPerformer,
      activeCount,
      totalCount: data.length,
    };
  }, [data]);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const getMarginColor = (margin: number) => {
    if (margin >= 40) return styles.kpiTrendUp;
    if (margin >= 20) return "";
    return styles.kpiTrendDown;
  };

  return (
    <div className={styles.kpiDashboard}>
      {/* Total Revenue */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconRevenue}`}>$</div>
          <span className={styles.kpiLabel}>Total Revenue</span>
        </div>
        <div className={styles.kpiValue}>
          {formatCurrency(metrics.totalRevenue)}
        </div>
        <div className={styles.kpiSubtext}>Last 12 months</div>
      </div>

      {/* Average Margin */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconMargin}`}>%</div>
          <span className={styles.kpiLabel}>Avg Margin</span>
        </div>
        <div className={styles.kpiValue}>
          {metrics.avgMargin.toFixed(1)}%
          <span className={`${styles.kpiTrend} ${getMarginColor(metrics.avgMargin)}`}>
            {metrics.avgMargin >= 40 ? "Healthy" : metrics.avgMargin >= 20 ? "Fair" : "Low"}
          </span>
        </div>
        <div className={styles.kpiSubtext}>Weighted by revenue</div>
      </div>

      {/* Low Stock Alerts */}
      <div
        className={`${styles.kpiCard} ${styles.kpiCardClickable}`}
        onClick={onFilterLowStock}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onFilterLowStock?.()}
      >
        <div className={styles.kpiHeader}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconAlert}`}>!</div>
          <span className={styles.kpiLabel}>Low Stock Alerts</span>
        </div>
        <div className={styles.kpiValue}>
          {metrics.lowStockCount}
          {metrics.lowStockCount > 0 && (
            <span className={`${styles.kpiTrend} ${styles.kpiTrendDown}`}>
              Action needed
            </span>
          )}
        </div>
        <div className={styles.kpiSubtext}>Click to filter</div>
      </div>

      {/* Top Performer */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconTop}`}>★</div>
          <span className={styles.kpiLabel}>Top Performer</span>
        </div>
        <div className={styles.kpiValue} style={{ fontSize: "16px" }}>
          {metrics.topPerformer?.name || "N/A"}
        </div>
        <div className={styles.kpiSubtext}>
          {metrics.topPerformer
            ? formatCurrency(metrics.topPerformer.revenue)
            : "No data"}
        </div>
      </div>

      {/* Active Products */}
      <div className={styles.kpiCard}>
        <div className={styles.kpiHeader}>
          <div className={`${styles.kpiIcon} ${styles.kpiIconActive}`}>●</div>
          <span className={styles.kpiLabel}>Active Products</span>
        </div>
        <div className={styles.kpiValue}>
          {metrics.activeCount}/{metrics.totalCount}
        </div>
        <div className={styles.kpiSubtext}>
          {((metrics.activeCount / metrics.totalCount) * 100).toFixed(0)}% of
          catalog
        </div>
      </div>
    </div>
  );
}
