"use client";

import { memo, useEffect, useRef, useState } from "react";
import type { ComponentRenderProps } from "@onegenui/react";
import type {
  StockChartProps,
  OHLCData,
  Timeframe,
  StockSeries,
} from "./schema";
import { cn } from "../../utils/cn";

// Lazy import holder for lightweight-charts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let chartsModule: any = null;

// --- Helper Functions ---

const getTimeframeDays = (tf: Timeframe): number => {
  switch (tf) {
    case "1D":
      return 1;
    case "1W":
      return 7;
    case "1M":
      return 30;
    case "3M":
      return 90;
    case "1Y":
      return 365;
    case "5Y":
      return 365 * 5;
    case "10Y":
      return 365 * 10;
    default:
      return 0; // ALL
  }
};

const filterDataByTimeframe = (
  data: OHLCData[],
  timeframe: Timeframe,
): OHLCData[] => {
  if (!timeframe || timeframe === "ALL" || !data.length) return data;

  const days = getTimeframeDays(timeframe);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  if (!cutoffStr) return data;

  return data.filter((d) => d.time >= cutoffStr);
};

// --- Component ---

export const StockChart = memo(function StockChart({
  element,
}: ComponentRenderProps) {
  const props = element.props as StockChartProps;

  // Extract data from the first series if available
  const primarySeries: StockSeries | undefined = props.series?.[0];
  const symbol = primarySeries?.symbol || "Unknown";
  const initialData = primarySeries?.data || [];
  const height = props.height ?? 400;

  // Colors can be customized here or derived from theme/props if extended
  const upColor = "#22c55e";
  const downColor = "#ef4444";

  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  const [timeframe, setTimeframe] = useState<Timeframe>(
    props.timeframe || "3M",
  );
  const filteredData = filterDataByTimeframe(initialData, timeframe);

  // Load lightweight-charts dynamically
  useEffect(() => {
    if (!chartsModule) {
      import("lightweight-charts").then((mod) => {
        chartsModule = mod;
        initChart();
      });
    } else {
      initChart();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update data when timeframe/data changes
  useEffect(() => {
    if (seriesRef.current && filteredData.length > 0) {
      seriesRef.current.setData(filteredData);
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [filteredData]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const initChart = () => {
    if (!containerRef.current || !chartsModule) return;

    if (chartRef.current) {
      chartRef.current.remove();
    }

    const { createChart } = chartsModule;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#a1a1aa", // muted-foreground
      },
      grid: {
        vertLines: { color: "#27272a" }, // border
        horzLines: { color: "#27272a" }, // border
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#27272a",
      },
      crosshair: {
        vertLine: {
          color: "#71717a",
          labelBackgroundColor: "#71717a",
        },
        horzLine: {
          color: "#71717a",
          labelBackgroundColor: "#71717a",
        },
      },
    });

    const series = chart.addCandlestickSeries({
      upColor: upColor,
      downColor: downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor,
    });

    series.setData(filteredData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;
  };

  const timeframes: Timeframe[] = ["1D", "1W", "1M", "3M", "1Y", "5Y", "ALL"];

  return (
    <div className="flex flex-col gap-3 p-4 glass-panel bg-card/80 backdrop-blur-md border border-border/50 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-2">
        <h3 className="m-0 text-sm font-semibold text-foreground">
          {symbol} Stock Price
        </h3>

        {/* Timeframe Selector */}
        <div className="flex gap-1 bg-muted/20 p-1 rounded-md">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={cn(
                "px-2 py-1 text-xs font-medium rounded transition-all",
                timeframe === tf
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
              )}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div
        className="relative w-full overflow-hidden rounded bg-black/5 h-[var(--chart-height)]"
        style={{ "--chart-height": `${height}px` } as React.CSSProperties}
      >
        <div ref={containerRef} className="w-full h-full" />
        {!filteredData.length && (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            No data available for this timeframe
          </div>
        )}
      </div>
    </div>
  );
});
