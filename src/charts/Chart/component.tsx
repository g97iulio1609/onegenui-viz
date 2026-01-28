"use client";

import { memo, useMemo, useState } from "react";
import {
  type ComponentRenderProps,
  useData,
  useItemSelection,
} from "@onegenui/react";
import { resolveArrayProp } from "../../utils/data-utils";
import { cn } from "../../utils/cn";

type SeriesData = {
  name: string;
  data: number[];
  color?: string | null;
};

type ChartDatum = {
  label: string;
  value: number;
  color?: string | null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_HEIGHT = 200;
const MIN_HEIGHT = 120;
const Y_AXIS_WIDTH = 40;
const BAR_GAP = 6;
const DEFAULT_COLORS = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f97316", // orange
  "#a855f7", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#eab308", // yellow
  "#ef4444", // red
];

// ─────────────────────────────────────────────────────────────────────────────
// Utility Functions
// ─────────────────────────────────────────────────────────────────────────────

function formatValue(value: number | undefined | null): string {
  if (value == null || typeof value !== "number" || isNaN(value)) {
    return "-";
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

function calculateNiceTickValues(
  min: number,
  max: number,
  targetTicks = 5,
): number[] {
  if (max <= min) return [0];

  const range = max - min;
  const roughStep = range / (targetTicks - 1);

  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalizedStep = roughStep / magnitude;

  let niceStep: number;
  if (normalizedStep <= 1.5) niceStep = 1;
  else if (normalizedStep <= 3) niceStep = 2;
  else if (normalizedStep <= 7) niceStep = 5;
  else niceStep = 10;

  niceStep *= magnitude;

  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;

  const ticks: number[] = [];
  for (let tick = niceMin; tick <= niceMax; tick += niceStep) {
    ticks.push(tick);
  }

  return ticks;
}

function hexToRgba(hex: string, alpha: number): string {
  if (!hex || !hex.startsWith("#")) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chart Component
// ─────────────────────────────────────────────────────────────────────────────

export const Chart = memo(function Chart({
  element,
  children,
}: ComponentRenderProps) {
  const { title, data, dataPath, height, series, categories } =
    element.props as {
      title?: string | null;
      dataPath?: string;
      data?: ChartDatum[];
      height?: number;
      series?: SeriesData[];
      categories?: string[];
    };

  const { data: globalData } = useData();

  // Convert series format to chartData format if series is provided
  const chartData = useMemo(() => {
    if (series && series.length > 0 && categories && categories.length > 0) {
      // For multi-series, flatten to simple bar chart using first series
      const firstSeries = series[0]!;
      return categories.map((label, i) => ({
        label,
        value: firstSeries.data[i] ?? 0,
        color: firstSeries.color,
      }));
    }
    return resolveArrayProp<ChartDatum>(globalData, data, dataPath);
  }, [series, categories, globalData, data, dataPath]);

  const chartHeight = Math.max(height || DEFAULT_HEIGHT, MIN_HEIGHT);

  const { selectedItems, isItemSelected } = useItemSelection(element.key);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Memoize calculations
  const { ticks, normalizedData } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { maxValue: 0, minValue: 0, ticks: [], normalizedData: [] };
    }

    const values = chartData.map((d) => d.value);
    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);

    // Ensure we have some range
    const effectiveMax = max === min ? max + 10 : max;

    const computedTicks = calculateNiceTickValues(
      Math.min(min, 0),
      effectiveMax,
      5,
    );
    const tickMax = computedTicks[computedTicks.length - 1] ?? effectiveMax;
    const tickMin = computedTicks[0] ?? 0;
    const range = tickMax - tickMin;

    return {
      maxValue: tickMax,
      minValue: tickMin,
      ticks: computedTicks,
      normalizedData: chartData.map((d, i) => ({
        ...d,
        color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
        percentage: range === 0 ? 0 : ((d.value - tickMin) / range) * 100,
      })),
    };
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 sm:p-8 bg-card border border-border rounded-lg sm:rounded-xl text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full glass-panel bg-card/80 backdrop-blur-md border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-lg">
      {/* Title */}
      {title && (
        <h3 className="text-xs sm:text-sm font-semibold mb-3 sm:mb-4 text-foreground">{title}</h3>
      )}

      {/* Chart Area */}
      <div
        className="relative w-full"
        style={{ height: `${chartHeight}px` }}
      >
        {/* Y-Axis Grid Lines & Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {ticks
            .slice()
            .reverse()
            .map((tick) => (
              <div key={tick} className="flex items-center w-full h-0 relative">
                <div
                  className="border-t border-border border-dashed"
                  style={{
                    marginLeft: `${Y_AXIS_WIDTH + 4}px`,
                    width: `calc(100% - ${Y_AXIS_WIDTH + 4}px)`,
                  }}
                />
                <span className="absolute left-0 text-[0.5rem] sm:text-[0.625rem] text-muted-foreground text-right -translate-y-1/2 pr-1" style={{ width: `${Y_AXIS_WIDTH}px` }}>
                  {formatValue(tick)}
                </span>
              </div>
            ))}
        </div>

        {/* Bars Container */}
        <div
          className="absolute inset-0 flex items-end justify-between pt-2 sm:pt-3 pb-5 sm:pb-6"
          style={{
            left: `${Y_AXIS_WIDTH + 4}px`,
            right: 0,
          }}
        >
          {normalizedData.map((d, i) => {
            const itemId = i.toString();
            const isSelected = isItemSelected(itemId);
            const isHovered = hoveredIndex === i;
            const barHeight = `${d.percentage}%`;

            return (
              <div
                key={i}
                data-selectable-item
                data-element-key={element.key}
                data-item-id={itemId}
                className="relative flex-1 h-full flex flex-col justify-end items-center group/bar cursor-pointer touch-manipulation"
                style={{ padding: `0 ${BAR_GAP / 2}px` }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                onTouchStart={() => setHoveredIndex(i)}
                onTouchEnd={() => setHoveredIndex(null)}
              >
                {/* Tooltip (visible on hover) */}
                {(isHovered || isSelected) && (
                  <div
                    className={cn(
                      "absolute bottom-full mb-1 z-20 px-1.5 sm:px-2 py-0.5 sm:py-1",
                      "bg-popover text-popover-foreground text-[0.625rem] sm:text-xs font-medium rounded shadow-md pointer-events-none whitespace-nowrap",
                      "animate-in fade-in zoom-in-95 duration-200",
                    )}
                  >
                    <span className="opacity-70 mr-0.5 sm:mr-1">{d.label}:</span>
                    {formatValue(d.value)}
                  </div>
                )}

                {/* The Bar */}
                <div
                  className={cn(
                    "w-full rounded-t transition-all duration-200 relative",
                    isSelected
                      ? "opacity-100 ring-2 ring-primary ring-offset-1"
                      : "opacity-85 hover:opacity-100",
                  )}
                  style={{
                    height: barHeight,
                    backgroundColor: d.color,
                    boxShadow: isHovered
                      ? `0 0 10px ${hexToRgba(d.color || "#000", 0.4)}`
                      : "none",
                  }}
                />

                {/* X-Axis Label */}
                <div className="absolute top-full mt-1 sm:mt-2 text-[0.5rem] sm:text-[0.625rem] text-muted-foreground truncate w-full text-center max-w-full">
                  {d.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {children}
    </div>
  );
});
