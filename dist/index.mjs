"use client";

// src/charts/Chart/component.tsx
import { memo, useMemo, useState } from "react";
import {
  useData,
  useItemSelection
} from "@onegenui/react";

// src/utils/data-utils.ts
import {
  resolveArrayProp,
  resolveValueProp,
  resolveString
} from "@onegenui/utils";

// src/utils/cn.ts
import { cn } from "@onegenui/utils";

// src/charts/Chart/component.tsx
import { jsx, jsxs } from "react/jsx-runtime";
var DEFAULT_HEIGHT = 200;
var MIN_HEIGHT = 120;
var Y_AXIS_WIDTH = 48;
var BAR_GAP = 8;
var DEFAULT_COLORS = [
  "#3b82f6",
  // blue
  "#22c55e",
  // green
  "#f97316",
  // orange
  "#a855f7",
  // purple
  "#ec4899",
  // pink
  "#14b8a6",
  // teal
  "#eab308",
  // yellow
  "#ef4444"
  // red
];
function formatValue(value) {
  if (value == null || typeof value !== "number" || isNaN(value)) {
    return "-";
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}K`;
  }
  return value.toFixed(0);
}
function calculateNiceTickValues(min, max, targetTicks = 5) {
  if (max <= min) return [0];
  const range = max - min;
  const roughStep = range / (targetTicks - 1);
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
  const normalizedStep = roughStep / magnitude;
  let niceStep;
  if (normalizedStep <= 1.5) niceStep = 1;
  else if (normalizedStep <= 3) niceStep = 2;
  else if (normalizedStep <= 7) niceStep = 5;
  else niceStep = 10;
  niceStep *= magnitude;
  const niceMin = Math.floor(min / niceStep) * niceStep;
  const niceMax = Math.ceil(max / niceStep) * niceStep;
  const ticks = [];
  for (let tick = niceMin; tick <= niceMax; tick += niceStep) {
    ticks.push(tick);
  }
  return ticks;
}
function hexToRgba(hex, alpha) {
  if (!hex || !hex.startsWith("#")) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
var Chart = memo(function Chart2({
  element,
  children
}) {
  const { title, data, dataPath, height, series, categories } = element.props;
  const { data: globalData } = useData();
  const chartData = useMemo(() => {
    if (series && series.length > 0 && categories && categories.length > 0) {
      const firstSeries = series[0];
      return categories.map((label, i) => ({
        label,
        value: firstSeries.data[i] ?? 0,
        color: firstSeries.color
      }));
    }
    return resolveArrayProp(globalData, data, dataPath);
  }, [series, categories, globalData, data, dataPath]);
  const chartHeight = Math.max(height || DEFAULT_HEIGHT, MIN_HEIGHT);
  const { selectedItems, isItemSelected } = useItemSelection(element.key);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { ticks, normalizedData } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return { maxValue: 0, minValue: 0, ticks: [], normalizedData: [] };
    }
    const values = chartData.map((d) => d.value);
    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);
    const effectiveMax = max === min ? max + 10 : max;
    const computedTicks = calculateNiceTickValues(
      Math.min(min, 0),
      effectiveMax,
      5
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
        percentage: range === 0 ? 0 : (d.value - tickMin) / range * 100
      }))
    };
  }, [chartData]);
  if (!chartData || chartData.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-8 bg-card border border-border rounded-lg text-muted-foreground", children: "No data available" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full h-full glass-panel bg-card/80 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-lg", children: [
    title && /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold mb-4 text-foreground", children: title }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative w-full h-[var(--chart-height)]",
        style: { "--chart-height": `${chartHeight}px` },
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex flex-col justify-between pointer-events-none", children: ticks.slice().reverse().map((tick) => /* @__PURE__ */ jsxs("div", { className: "flex items-center w-full h-0 relative", children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                className: "w-full border-t border-border border-dashed ml-[var(--grid-offset)] w-[calc(100%-var(--grid-offset))]",
                style: {
                  "--grid-offset": `${Y_AXIS_WIDTH + 8}px`
                }
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "absolute left-0 text-[10px] text-muted-foreground w-[48px] text-right -translate-y-1/2 pr-2", children: formatValue(tick) })
          ] }, tick)) }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute inset-0 flex items-end justify-between pt-3 pb-6 left-[var(--left-offset)] right-0",
              style: {
                "--left-offset": `${Y_AXIS_WIDTH + 8}px`
              },
              children: normalizedData.map((d, i) => {
                const itemId = i.toString();
                const isSelected = isItemSelected(itemId);
                const isHovered = hoveredIndex === i;
                const barHeight = `${d.percentage}%`;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    "data-selectable-item": true,
                    "data-element-key": element.key,
                    "data-item-id": itemId,
                    className: "relative flex-1 h-full flex flex-col justify-end items-center group/bar cursor-pointer px-[var(--bar-padding)]",
                    style: { "--bar-padding": `${BAR_GAP / 2}px` },
                    onMouseEnter: () => setHoveredIndex(i),
                    onMouseLeave: () => setHoveredIndex(null),
                    children: [
                      (isHovered || isSelected) && /* @__PURE__ */ jsxs(
                        "div",
                        {
                          className: cn(
                            "absolute bottom-full mb-1 z-20 px-2 py-1",
                            "bg-popover text-popover-foreground text-xs font-medium rounded shadow-md pointer-events-none whitespace-nowrap",
                            "animate-in fade-in zoom-in-95 duration-200"
                          ),
                          children: [
                            /* @__PURE__ */ jsxs("span", { className: "opacity-70 mr-1", children: [
                              d.label,
                              ":"
                            ] }),
                            formatValue(d.value)
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          className: cn(
                            "w-full rounded-t transition-all duration-200 relative h-[var(--bar-height)] bg-[var(--bar-color)] shadow-[var(--bar-shadow)]",
                            isSelected ? "opacity-100 ring-2 ring-primary ring-offset-1" : "opacity-85 hover:opacity-100"
                          ),
                          style: {
                            "--bar-height": barHeight,
                            "--bar-color": d.color,
                            "--bar-shadow": isHovered ? `0 0 10px ${hexToRgba(d.color || "#000", 0.4)}` : "none"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx("div", { className: "absolute top-full mt-2 text-[10px] text-muted-foreground truncate w-full text-center max-w-full", children: d.label })
                    ]
                  },
                  i
                );
              })
            }
          )
        ]
      }
    ),
    children
  ] });
});

// src/charts/Chart/schema.ts
import { z } from "zod";

// src/utils/shared-schemas.ts
import {
  chartDatumSchema,
  listItemSchema,
  timelineItemSchema,
  toDoItemSchema,
  tableRowSchema,
  mindMapNodeSchema,
  graphNodeSchema,
  graphEdgeSchema,
  kanbanItemSchema,
  kanbanColumnSchema,
  ganttTaskSchema,
  emailItemSchema,
  workoutSetSchema,
  exerciseSchema,
  mealItemSchema,
  mealSchema,
  messageItemSchema,
  participantSchema
} from "@onegenui/schemas";

// src/charts/Chart/schema.ts
var seriesSchema = z.object({
  name: z.string(),
  data: z.array(z.number()),
  color: z.string().nullable()
});
var ChartPropsSchema = z.object({
  title: z.string().nullable(),
  data: z.array(chartDatumSchema).nullable(),
  dataPath: z.string().nullable(),
  height: z.number().nullable(),
  // Multi-series support
  series: z.array(seriesSchema).nullable(),
  categories: z.array(z.string()).nullable()
});
var ChartDefinition = {
  name: "Chart",
  props: ChartPropsSchema,
  description: "Display a chart from array data",
  hasChildren: true
};

// src/charts/StockChart/component.tsx
import { memo as memo2, useEffect, useRef, useState as useState2 } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var chartsModule = null;
var getTimeframeDays = (tf) => {
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
      return 0;
  }
};
var filterDataByTimeframe = (data, timeframe) => {
  if (!timeframe || timeframe === "ALL" || !data.length) return data;
  const days = getTimeframeDays(timeframe);
  const cutoff = /* @__PURE__ */ new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  if (!cutoffStr) return data;
  return data.filter((d) => d.time >= cutoffStr);
};
var StockChart = memo2(function StockChart2({
  element
}) {
  const props = element.props;
  const primarySeries = props.series?.[0];
  const symbol = primarySeries?.symbol || "Unknown";
  const initialData = primarySeries?.data || [];
  const height = props.height ?? 400;
  const upColor = "#22c55e";
  const downColor = "#ef4444";
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [timeframe, setTimeframe] = useState2(
    props.timeframe || "3M"
  );
  const filteredData = filterDataByTimeframe(initialData, timeframe);
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
  }, []);
  useEffect(() => {
    if (seriesRef.current && filteredData.length > 0) {
      seriesRef.current.setData(filteredData);
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [filteredData]);
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && containerRef.current) {
        chartRef.current.applyOptions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
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
        textColor: "#a1a1aa"
        // muted-foreground
      },
      grid: {
        vertLines: { color: "#27272a" },
        // border
        horzLines: { color: "#27272a" }
        // border
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true
      },
      rightPriceScale: {
        borderColor: "#27272a"
      },
      crosshair: {
        vertLine: {
          color: "#71717a",
          labelBackgroundColor: "#71717a"
        },
        horzLine: {
          color: "#71717a",
          labelBackgroundColor: "#71717a"
        }
      }
    });
    const series = chart.addCandlestickSeries({
      upColor,
      downColor,
      borderVisible: false,
      wickUpColor: upColor,
      wickDownColor: downColor
    });
    series.setData(filteredData);
    chart.timeScale().fitContent();
    chartRef.current = chart;
    seriesRef.current = series;
  };
  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "5Y", "ALL"];
  return /* @__PURE__ */ jsxs2("div", { className: "flex flex-col gap-3 p-4 glass-panel bg-card/80 backdrop-blur-md border border-border/50 rounded-xl shadow-lg", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex justify-between items-center flex-wrap gap-2", children: [
      /* @__PURE__ */ jsxs2("h3", { className: "m-0 text-sm font-semibold text-foreground", children: [
        symbol,
        " Stock Price"
      ] }),
      /* @__PURE__ */ jsx2("div", { className: "flex gap-1 bg-muted/20 p-1 rounded-md", children: timeframes.map((tf) => /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: () => setTimeframe(tf),
          className: cn(
            "px-2 py-1 text-xs font-medium rounded transition-all",
            timeframe === tf ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          ),
          children: tf
        },
        tf
      )) })
    ] }),
    /* @__PURE__ */ jsxs2(
      "div",
      {
        className: "relative w-full overflow-hidden rounded bg-black/5 h-[var(--chart-height)]",
        style: { "--chart-height": `${height}px` },
        children: [
          /* @__PURE__ */ jsx2("div", { ref: containerRef, className: "w-full h-full" }),
          !filteredData.length && /* @__PURE__ */ jsx2("div", { className: "absolute inset-0 flex items-center justify-center text-muted-foreground text-sm", children: "No data available for this timeframe" })
        ]
      }
    )
  ] });
});

// src/charts/StockChart/schema.ts
import { z as z2 } from "zod";
var ohlcSchema = z2.object({
  time: z2.string().describe("Date in YYYY-MM-DD format"),
  open: z2.number().describe("Opening price"),
  high: z2.number().describe("Highest price"),
  low: z2.number().describe("Lowest price"),
  close: z2.number().describe("Closing price"),
  volume: z2.number().nullable().optional().describe("Trading volume")
});
var stockSeriesSchema = z2.object({
  symbol: z2.string().describe("Stock ticker symbol (e.g., AAPL, GOOGL)"),
  name: z2.string().describe("Full company/instrument name"),
  color: z2.string().describe("Hex color for the series line (e.g., #3b82f6)"),
  data: z2.array(ohlcSchema).describe("Array of OHLC data points")
});
var technicalLevelSchema = z2.object({
  price: z2.number().describe("Price level"),
  type: z2.enum(["support", "resistance"]).describe("Type of technical level"),
  strength: z2.number().nullable().optional().describe("Strength indicator (0-1)"),
  label: z2.string().nullable().optional().describe("Custom label for the level")
});
var timeframeSchema = z2.enum(["1D", "1W", "1M", "3M", "1Y", "5Y", "10Y", "ALL"]).describe("Time period to display");
var StockChartPropsSchema = z2.object({
  title: z2.string().nullable().optional().describe("Chart title"),
  series: z2.array(stockSeriesSchema).nullable().optional().describe("Array of stock series to display"),
  levels: z2.array(technicalLevelSchema).nullable().optional().describe("Technical support/resistance levels"),
  chartType: z2.enum(["Line", "Candlestick"]).nullable().optional().describe("Chart visualization type"),
  timeframe: timeframeSchema.nullable().optional().describe("Initial timeframe selection"),
  height: z2.number().nullable().optional().describe("Chart height in pixels (default: 400)"),
  showLevels: z2.boolean().nullable().optional().describe("Show support/resistance levels (default: true)"),
  showVolume: z2.boolean().nullable().optional().describe("Show volume bars (default: false)")
});
var StockChartDefinition = {
  name: "StockChart",
  props: StockChartPropsSchema,
  description: "Interactive financial chart with candlestick/line views, multiple series comparison, and technical levels",
  hasChildren: false
};

// src/graphs/MindMap/component.tsx
import { memo as memo4, useMemo as useMemo2 } from "react";

// src/graphs/MindMap/components/types.ts
var DEPTH_COLORS = [
  { bg: "rgba(59, 130, 246, 0.1)", border: "#3b82f6", text: "#60a5fa" },
  { bg: "rgba(168, 85, 247, 0.1)", border: "#a855f7", text: "#c084fc" },
  { bg: "rgba(34, 197, 94, 0.1)", border: "#22c55e", text: "#4ade80" },
  { bg: "rgba(249, 115, 22, 0.1)", border: "#f97316", text: "#fb923c" },
  { bg: "rgba(236, 72, 153, 0.1)", border: "#ec4899", text: "#f472b6" },
  { bg: "rgba(20, 184, 166, 0.1)", border: "#14b8a6", text: "#2dd4bf" }
];
function getColorForDepth(depth) {
  return DEPTH_COLORS[depth % DEPTH_COLORS.length];
}
function buildTreeFromFlat(nodes) {
  if (!Array.isArray(nodes)) return [];
  const nodeMap = /* @__PURE__ */ new Map();
  const roots = [];
  nodes.forEach((n) => {
    nodeMap.set(n.id, { ...n, children: n.children ? [...n.children] : [] });
  });
  nodes.forEach((n) => {
    const node = nodeMap.get(n.id);
    const parentId = n.parentId || n.parent;
    if (parentId && nodeMap.has(parentId)) {
      const parent = nodeMap.get(parentId);
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots.length > 0 ? roots : nodes;
}

// src/graphs/MindMap/components/node-renderer.tsx
import { memo as memo3, useState as useState3, useCallback, useRef as useRef2, useLayoutEffect } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
var NodeRenderer = memo3(function NodeRenderer2({
  node,
  depth,
  isHorizontal,
  expandedByDefault,
  elementKey
}) {
  const [expanded, setExpanded] = useState3(expandedByDefault);
  const hasChildren = node.children && node.children.length > 0;
  const defaultColors = getColorForDepth(depth);
  const colors = node.color ? { bg: `${node.color}15`, border: node.color, text: node.color } : defaultColors;
  const nodeRef = useRef2(null);
  const childrenRef = useRef2(null);
  const [paths, setPaths] = useState3([]);
  const updatePaths = useCallback(() => {
    if (!expanded || !hasChildren || !nodeRef.current || !childrenRef.current) {
      setPaths([]);
      return;
    }
    const parentRect = nodeRef.current.getBoundingClientRect();
    const containerRect = childrenRef.current.getBoundingClientRect();
    const childrenNodes = Array.from(
      childrenRef.current.children
    );
    const newPaths = [];
    childrenNodes.forEach((child) => {
      const anchor = child.querySelector("[data-node-anchor]");
      if (!anchor) return;
      const anchorRect = anchor.getBoundingClientRect();
      const startY = parentRect.top + parentRect.height / 2 - containerRect.top;
      const endY = anchorRect.top + anchorRect.height / 2 - containerRect.top;
      const width = 64;
      const p1 = { x: 0, y: startY };
      const p2 = { x: width, y: endY };
      const c1 = { x: width * 0.4, y: startY };
      const c2 = { x: width * 0.6, y: endY };
      newPaths.push(
        `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`
      );
    });
    setPaths(newPaths);
  }, [expanded, hasChildren]);
  useLayoutEffect(() => {
    updatePaths();
    window.addEventListener("resize", updatePaths);
    return () => window.removeEventListener("resize", updatePaths);
  }, [updatePaths]);
  const toggleExpand = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: cn(
        "flex relative",
        isHorizontal ? "flex-row items-center" : "flex-col items-center"
      ),
      children: [
        /* @__PURE__ */ jsxs3("div", { ref: nodeRef, className: "relative group z-10 flex items-center", children: [
          /* @__PURE__ */ jsxs3(
            "div",
            {
              "data-node-anchor": true,
              "data-selectable-item": true,
              "data-element-key": elementKey,
              "data-item-id": node.id,
              className: cn(
                "relative border rounded-xl transition-all duration-300 shadow-sm",
                "backdrop-blur-md bg-card/90 border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5",
                "flex items-center gap-3 p-3 min-w-[140px] max-w-[240px]",
                depth === 0 ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20" : ""
              ),
              style: {
                borderColor: colors.border,
                backgroundColor: depth === 0 ? void 0 : colors.bg
              },
              children: [
                node.icon && /* @__PURE__ */ jsx3("span", { className: "text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-background/50 border border-white/10", children: node.icon }),
                /* @__PURE__ */ jsxs3("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx3(
                    "div",
                    {
                      className: cn(
                        "font-semibold leading-tight truncate",
                        depth === 0 ? "text-[15px]" : "text-[13px]"
                      ),
                      style: { color: depth === 0 ? void 0 : colors.text },
                      children: node.label
                    }
                  ),
                  node.description && /* @__PURE__ */ jsx3("div", { className: "text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2", children: node.description })
                ] })
              ]
            }
          ),
          hasChildren && /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: toggleExpand,
              className: cn(
                "ml-[-10px] z-20 w-6 h-6 rounded-full flex items-center justify-center",
                "bg-background border border-border shadow-sm hover:scale-110 transition-transform",
                "text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
              ),
              style: {
                marginLeft: -12,
                marginRight: -12,
                position: "relative",
                left: 12
              },
              children: expanded ? "\u2212" : "+"
            }
          )
        ] }),
        hasChildren && expanded && /* @__PURE__ */ jsxs3("div", { className: "flex flex-row items-stretch", children: [
          isHorizontal && /* @__PURE__ */ jsx3("div", { className: "w-16 relative shrink-0", children: /* @__PURE__ */ jsx3("svg", { className: "absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none", children: paths.map((d, i) => /* @__PURE__ */ jsx3(
            "path",
            {
              d,
              fill: "none",
              stroke: "hsl(var(--border))",
              strokeWidth: "1.5",
              opacity: "0.5",
              className: "transition-all duration-500"
            },
            i
          )) }) }),
          /* @__PURE__ */ jsx3(
            "div",
            {
              ref: childrenRef,
              className: cn(
                "flex",
                isHorizontal ? "flex-col gap-4 py-2" : "flex-row gap-4"
              ),
              children: node.children.map((child) => /* @__PURE__ */ jsx3(
                NodeRenderer2,
                {
                  node: child,
                  depth: depth + 1,
                  isHorizontal,
                  expandedByDefault,
                  elementKey
                },
                child.id
              ))
            }
          )
        ] })
      ]
    }
  );
});

// src/graphs/MindMap/component.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
var MindMap = memo4(function MindMap2({
  element,
  children
}) {
  const { title, nodes, layout, expandedByDefault } = element.props;
  const isHorizontal = layout !== "vertical";
  const defaultExpanded = expandedByDefault !== false;
  const rootNodes = useMemo2(() => {
    if (!nodes || !Array.isArray(nodes)) return [];
    return buildTreeFromFlat(nodes);
  }, [nodes]);
  if (!rootNodes.length) {
    return /* @__PURE__ */ jsx4("div", { className: "p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border", children: "No mind map data" });
  }
  return /* @__PURE__ */ jsxs4("div", { className: "w-full overflow-hidden", children: [
    title && /* @__PURE__ */ jsx4("h3", { className: "mb-4 text-lg font-semibold text-foreground flex items-center gap-2", children: title }),
    /* @__PURE__ */ jsx4(
      "div",
      {
        className: cn(
          "flex p-8 gap-12 overflow-auto glass-subtle rounded-2xl min-h-[400px]",
          isHorizontal ? "flex-col" : "flex-row"
        ),
        children: rootNodes.map((node) => /* @__PURE__ */ jsx4(
          NodeRenderer,
          {
            node,
            depth: 0,
            isHorizontal,
            expandedByDefault: defaultExpanded,
            elementKey: element.key
          },
          node.id
        ))
      }
    ),
    children
  ] });
});

// src/graphs/MindMap/schema.ts
import { z as z3 } from "zod";
var MindMapPropsSchema = z3.object({
  title: z3.string().nullable(),
  nodes: z3.array(mindMapNodeSchema),
  layout: z3.enum(["horizontal", "vertical"]).nullable(),
  expandedByDefault: z3.boolean().nullable()
});
var MindMapDefinition = {
  name: "MindMap",
  props: MindMapPropsSchema,
  description: "A hierarchical mind map. MUST use ",
  hasChildren: true
};

// src/graphs/Graph/component.tsx
import { memo as memo7, useCallback as useCallback2, useEffect as useEffect2, useMemo as useMemo3, useRef as useRef3, useState as useState4 } from "react";
import { useSelection } from "@onegenui/react";

// src/graphs/Graph/components/types.ts
var MAG = (v) => Math.sqrt(v.x * v.x + v.y * v.y);
var SUB = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
var ADD = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });
var MUL = (v, s) => ({ x: v.x * s, y: v.y * s });
var NORM = (v) => {
  const m = MAG(v);
  return m === 0 ? { x: 0, y: 0 } : { x: v.x / m, y: v.y / m };
};
function getIntersection(p1, p2, r2) {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: p2.x - dx / len * r2,
    y: p2.y - dy / len * r2
  };
}
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}
var PALETTE = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4"
];
function colorForGroup(group) {
  if (!group) return "var(--primary)";
  const idx = Math.abs(hashString(group)) % PALETTE.length;
  return PALETTE[idx] ?? "var(--primary)";
}
var DEFAULT_H = 400;
var REPULSION = 800;
var SPRING_LEN = 120;
var SPRING_K = 0.05;
var DAMPING = 0.85;
var CENTER_PULL = 0.02;
var DT = 0.1;
var MAX_ITERATIONS = 300;

// src/graphs/Graph/components/edges-renderer.tsx
import { memo as memo5 } from "react";
import { Fragment, jsx as jsx5 } from "react/jsx-runtime";
var EdgesRenderer = memo5(function EdgesRenderer2({
  edges,
  nodeStates
}) {
  return /* @__PURE__ */ jsx5(Fragment, { children: edges.map((e, i) => {
    const u = nodeStates.get(e.source);
    const v = nodeStates.get(e.target);
    if (!u || !v) return null;
    const targetRadius = v.size + 4;
    const end = getIntersection(u.pos, v.pos, targetRadius);
    return /* @__PURE__ */ jsx5("g", { children: /* @__PURE__ */ jsx5(
      "line",
      {
        x1: u.pos.x,
        y1: u.pos.y,
        x2: end.x,
        y2: end.y,
        stroke: "var(--border)",
        strokeWidth: 2,
        opacity: 0.6,
        markerEnd: "url(#arrow)"
      }
    ) }, `${e.source}-${e.target}-${i}`);
  }) });
});

// src/graphs/Graph/components/nodes-renderer.tsx
import { memo as memo6 } from "react";
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs5 } from "react/jsx-runtime";
var NodesRenderer = memo6(function NodesRenderer2({
  nodes,
  nodeStates,
  elementKey,
  isSelected,
  toggleSelection,
  onNodeDragStart
}) {
  return /* @__PURE__ */ jsx6(Fragment2, { children: nodes.map((n) => {
    const s = nodeStates.get(n.id);
    if (!s) return null;
    const selected = isSelected(elementKey, n.id);
    const color = n.color || colorForGroup(n.group);
    return /* @__PURE__ */ jsxs5(
      "g",
      {
        transform: `translate(${s.pos.x}, ${s.pos.y})`,
        onPointerDown: (e) => {
          e.stopPropagation();
          onNodeDragStart(n.id, e);
        },
        onClick: (e) => {
          e.stopPropagation();
          toggleSelection(elementKey, n.id);
        },
        className: "cursor-grab active:cursor-grabbing",
        children: [
          /* @__PURE__ */ jsx6(
            "circle",
            {
              r: s.size,
              fill: "var(--background)",
              stroke: selected ? "var(--primary)" : color,
              strokeWidth: selected ? 3 : 2,
              className: "transition-[stroke-width] duration-200"
            }
          ),
          /* @__PURE__ */ jsx6("circle", { r: s.size, fill: color, opacity: selected ? 0.2 : 0.1 }),
          /* @__PURE__ */ jsx6(
            "foreignObject",
            {
              x: -s.size * 1.5,
              y: -10,
              width: s.size * 3,
              height: 30,
              className: "pointer-events-none overflow-visible",
              children: /* @__PURE__ */ jsx6("div", { className: "flex justify-center items-center h-full", children: /* @__PURE__ */ jsx6("span", { className: "px-1.5 py-0.5 rounded-md text-xs font-medium text-black border border-black/10 whitespace-nowrap shadow-sm bg-white/85", children: n.label }) })
            }
          )
        ]
      },
      n.id
    );
  }) });
});

// src/graphs/Graph/component.tsx
import { jsx as jsx7, jsxs as jsxs6 } from "react/jsx-runtime";
var Graph = memo7(function Graph2({
  element,
  children
}) {
  const {
    title,
    nodes: propsNodes,
    edges: propsEdges,
    height
  } = element.props;
  const nodes = useMemo3(
    () => (propsNodes || []).filter((n) => !!n?.id),
    [propsNodes]
  );
  const edges = useMemo3(
    () => (propsEdges || []).filter((e) => !!e.source && !!e.target),
    [propsEdges]
  );
  const containerRef = useRef3(null);
  const [dimensions, setDimensions] = useState4({ w: 800, h: DEFAULT_H });
  const nodeStates = useRef3(/* @__PURE__ */ new Map());
  const rafRef = useRef3(void 0);
  const [bump, setBump] = useState4(0);
  const iterationCount = useRef3(0);
  const { isSelected, toggleSelection } = useSelection();
  const [pan, setPan] = useState4({ x: 0, y: 0 });
  const [zoom, setZoom] = useState4(1);
  const isDragging = useRef3(false);
  const dragNodeId = useRef3(null);
  const lastMousePos = useRef3({ x: 0, y: 0 });
  useEffect2(() => {
    const w = containerRef.current?.clientWidth || 800;
    const h = Math.max(240, height ?? DEFAULT_H);
    setDimensions({ w, h });
    const map = /* @__PURE__ */ new Map();
    const count = nodes.length;
    nodes.forEach((n, i) => {
      const angle = i / count * Math.PI * 2;
      const radius = count * 10;
      const baseSize = 20;
      const labelFactor = (n.label?.length || 0) * 2;
      const size = Math.max(
        28,
        Math.min(60, baseSize + (n.value || 0) + labelFactor * 0.3)
      );
      map.set(n.id, {
        pos: {
          x: w / 2 + Math.cos(angle) * radius,
          y: h / 2 + Math.sin(angle) * radius
        },
        vel: { x: 0, y: 0 },
        acc: { x: 0, y: 0 },
        mass: 1,
        size
      });
    });
    nodeStates.current = map;
    iterationCount.current = 0;
    setBump((b) => b + 1);
  }, [nodes, height]);
  useEffect2(() => {
    const center = { x: dimensions.w / 2, y: dimensions.h / 2 };
    const step = () => {
      if (iterationCount.current > MAX_ITERATIONS && !isDragging.current) {
        return;
      }
      const st = nodeStates.current;
      const nodeIds = Array.from(st.keys());
      for (let i = 0; i < nodeIds.length; i++) {
        const nodeIdI = nodeIds[i];
        if (!nodeIdI) continue;
        const u = st.get(nodeIdI);
        u.acc = { x: 0, y: 0 };
        const toCenter = SUB(center, u.pos);
        u.acc = ADD(u.acc, MUL(toCenter, CENTER_PULL));
        for (let j = i + 1; j < nodeIds.length; j++) {
          const nodeIdJ = nodeIds[j];
          if (!nodeIdJ) continue;
          const v = st.get(nodeIdJ);
          const delta = SUB(u.pos, v.pos);
          const dist = MAG(delta) || 0.1;
          if (dist < 500) {
            const force = REPULSION * 5 / (dist * dist);
            const dir = NORM(delta);
            u.acc = ADD(u.acc, MUL(dir, force));
            v.acc = ADD(v.acc, MUL(dir, -force));
          }
          const minDist = u.size + v.size + 10;
          if (dist < minDist) {
            const overlap = minDist - dist;
            const dir = NORM(delta);
            const separate = MUL(dir, overlap * 0.5);
            u.pos = ADD(u.pos, separate);
            v.pos = SUB(v.pos, separate);
          }
        }
      }
      edges.forEach((e) => {
        const u = st.get(e.source);
        const v = st.get(e.target);
        if (u && v) {
          const delta = SUB(v.pos, u.pos);
          const dist = MAG(delta) || 1;
          const force = (dist - SPRING_LEN) * SPRING_K;
          const dir = NORM(delta);
          u.acc = ADD(u.acc, MUL(dir, force));
          v.acc = ADD(v.acc, MUL(dir, -force));
        }
      });
      st.forEach((n, id) => {
        if (id !== dragNodeId.current) {
          n.vel = ADD(n.vel, MUL(n.acc, DT));
          n.vel = MUL(n.vel, DAMPING);
          n.pos = ADD(n.pos, MUL(n.vel, DT));
        }
      });
      iterationCount.current++;
      setBump((b) => b + 1);
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [edges, dimensions, nodes]);
  const handleWheel = useCallback2((e) => {
    e.stopPropagation();
    const d = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z6) => Math.max(0.1, Math.min(5, z6 * d)));
  }, []);
  const handlePointerDown = useCallback2((e) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);
  const handlePointerMove = useCallback2(
    (e) => {
      if (!isDragging.current) return;
      e.stopPropagation();
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      if (dragNodeId.current) {
        const st = nodeStates.current.get(dragNodeId.current);
        if (st) {
          st.pos.x += dx / zoom;
          st.pos.y += dy / zoom;
          st.vel = { x: 0, y: 0 };
          iterationCount.current = 0;
        }
      } else {
        setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      }
    },
    [zoom]
  );
  const handlePointerUp = useCallback2((e) => {
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDragging.current = false;
    dragNodeId.current = null;
  }, []);
  const handleNodeDragStart = useCallback2(
    (nodeId, e) => {
      isDragging.current = true;
      dragNodeId.current = nodeId;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    []
  );
  const renderedEdges = useMemo3(
    () => /* @__PURE__ */ jsx7(EdgesRenderer, { edges, nodeStates: nodeStates.current }),
    [edges, bump]
  );
  const renderedNodes = useMemo3(
    () => /* @__PURE__ */ jsx7(
      NodesRenderer,
      {
        nodes,
        nodeStates: nodeStates.current,
        elementKey: element.key,
        isSelected,
        toggleSelection,
        onNodeDragStart: handleNodeDragStart
      }
    ),
    [
      nodes,
      bump,
      isSelected,
      element.key,
      toggleSelection,
      handleNodeDragStart
    ]
  );
  return /* @__PURE__ */ jsxs6(
    "div",
    {
      ref: containerRef,
      style: {
        "--graph-height": `${Math.max(240, height ?? DEFAULT_H)}px`
      },
      className: cn(
        "relative w-full overflow-hidden rounded-xl border border-border/50 glass-panel bg-card/80 backdrop-blur-md touch-none select-none h-[var(--graph-height)] shadow-lg"
      ),
      onWheel: handleWheel,
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
      children: [
        title && /* @__PURE__ */ jsx7("div", { className: "absolute top-4 left-4 z-10 bg-background px-2 py-1 rounded border border-border font-semibold text-sm shadow-sm", children: title }),
        /* @__PURE__ */ jsxs6("div", { className: "absolute bottom-2.5 right-2.5 text-[10px] text-muted-foreground z-10", children: [
          "Zoom: ",
          Math.round(zoom * 100),
          "%"
        ] }),
        /* @__PURE__ */ jsxs6(
          "svg",
          {
            width: "100%",
            height: "100%",
            viewBox: `0 0 ${dimensions.w} ${dimensions.h}`,
            className: "block",
            children: [
              /* @__PURE__ */ jsx7("defs", { children: /* @__PURE__ */ jsx7(
                "marker",
                {
                  id: "arrow",
                  viewBox: "0 0 10 10",
                  refX: "9",
                  refY: "5",
                  markerWidth: "6",
                  markerHeight: "6",
                  orient: "auto",
                  children: /* @__PURE__ */ jsx7("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "var(--muted-foreground)" })
                }
              ) }),
              /* @__PURE__ */ jsxs6("g", { transform: `translate(${pan.x}, ${pan.y}) scale(${zoom})`, children: [
                renderedEdges,
                renderedNodes
              ] })
            ]
          }
        ),
        children
      ]
    }
  );
});

// src/graphs/Graph/schema.ts
import { z as z4 } from "zod";
var GraphPropsSchema = z4.object({
  title: z4.string().nullable(),
  nodes: z4.array(graphNodeSchema).nullable(),
  edges: z4.array(graphEdgeSchema).nullable(),
  layout: z4.enum(["force", "radial", "grid"]).nullable(),
  showLabels: z4.boolean().nullable(),
  showEdgeLabels: z4.boolean().nullable(),
  allowPanZoom: z4.boolean().nullable(),
  width: z4.number().nullable(),
  height: z4.number().nullable(),
  lock: z4.boolean().nullable()
});
var GraphDefinition = {
  name: "Graph",
  props: GraphPropsSchema,
  description: "Interactive graph (nodes + edges). IMPORTANT: Provide content via ",
  hasChildren: true
};

// src/graphs/Gantt/component.tsx
import { memo as memo8 } from "react";
import { jsx as jsx8, jsxs as jsxs7 } from "react/jsx-runtime";
var Gantt = memo8(function Gantt2({
  element,
  children
}) {
  const { title, tasks: initialTasks } = element.props;
  const tasks = initialTasks || [];
  if (tasks.length === 0) return null;
  const dates = tasks.flatMap((t) => [new Date(t.start), new Date(t.end)]).sort((a, b) => a.getTime() - b.getTime());
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];
  if (!minDate || !maxDate) return null;
  const totalDuration = maxDate.getTime() - minDate.getTime();
  const getLeft = (dateStr) => {
    if (!minDate) return 0;
    const d = new Date(dateStr);
    return (d.getTime() - minDate.getTime()) / totalDuration * 100;
  };
  const getWidth = (startStr, endStr) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    return (e.getTime() - s.getTime()) / totalDuration * 100;
  };
  const formatDate = (d) => new Date(d).toLocaleDateString(void 0, {
    month: "short",
    day: "numeric"
  });
  return /* @__PURE__ */ jsxs7("div", { className: "glass-panel bg-card/80 backdrop-blur-md border border-border/50 rounded-xl p-4 overflow-hidden shadow-lg", children: [
    title && /* @__PURE__ */ jsx8("h3", { className: "mb-5 text-lg font-bold text-foreground", children: title }),
    /* @__PURE__ */ jsx8(
      "div",
      {
        className: "relative min-h-[var(--gantt-height)]",
        style: {
          "--gantt-height": `${tasks.length * 40 + 40}px`
        },
        children: /* @__PURE__ */ jsx8("div", { className: "overflow-x-auto pb-3", children: /* @__PURE__ */ jsxs7("div", { className: "min-w-[600px]", children: [
          /* @__PURE__ */ jsxs7("div", { className: "flex justify-between mb-3 border-b border-border pb-2 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsx8("span", { children: tasks[0] ? formatDate(tasks[0].start) : "" }),
            /* @__PURE__ */ jsx8("span", { children: (() => {
              const lastTask = tasks[tasks.length - 1];
              return lastTask ? formatDate(lastTask.end) : "";
            })() })
          ] }),
          /* @__PURE__ */ jsx8("div", { className: "flex flex-col gap-3", children: tasks.map((task, index) => {
            const paddingLeft = getLeft(task.start);
            const width = getWidth(task.start, task.end);
            const isMilestone = task.type === "milestone" || width === 0;
            const itemId = task.id || `task-${index}`;
            return /* @__PURE__ */ jsxs7(
              "div",
              {
                "data-selectable-item": true,
                "data-element-key": element.key,
                "data-item-id": itemId,
                className: "flex items-center h-7 rounded px-1 cursor-pointer hover:bg-muted/50 transition-colors",
                children: [
                  /* @__PURE__ */ jsx8("div", { className: "w-1/5 pr-3 text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap text-foreground", children: task.name }),
                  /* @__PURE__ */ jsx8(
                    "div",
                    {
                      className: cn(
                        "flex-1 relative h-full rounded",
                        isMilestone ? "bg-transparent" : "bg-muted/30"
                      ),
                      children: isMilestone ? /* @__PURE__ */ jsx8(
                        "div",
                        {
                          className: "absolute w-4 h-4 z-10 border-2 border-white shadow-sm left-[var(--milestone-left)] bg-[var(--milestone-color)] rotate-45 -translate-x-1/2 origin-left",
                          style: {
                            "--milestone-left": `${paddingLeft}%`,
                            "--milestone-color": task.color || "#eab308"
                          },
                          title: `Milestone: ${task.name}`
                        }
                      ) : /* @__PURE__ */ jsxs7(
                        "div",
                        {
                          className: "absolute h-full rounded opacity-90 flex items-center pl-2 text-white text-[10px] overflow-hidden left-[var(--task-left)] w-[var(--task-width)] bg-[var(--task-color)]",
                          style: {
                            "--task-left": `${paddingLeft}%`,
                            "--task-width": `${width}%`,
                            "--task-color": task.color || "var(--primary)"
                          },
                          title: `${task.name}: ${task.progress}%`,
                          children: [
                            width > 10 && /* @__PURE__ */ jsxs7("span", { className: "z-[2]", children: [
                              task.progress,
                              "%"
                            ] }),
                            /* @__PURE__ */ jsx8(
                              "div",
                              {
                                className: "absolute left-0 top-0 bottom-0 bg-white opacity-20 w-[var(--task-progress)]",
                                style: {
                                  "--task-progress": `${task.progress}%`
                                }
                              }
                            )
                          ]
                        }
                      )
                    }
                  )
                ]
              },
              itemId
            );
          }) })
        ] }) })
      }
    ),
    children && /* @__PURE__ */ jsx8("div", { className: "mt-6 space-y-4", children })
  ] });
});

// src/graphs/Gantt/schema.ts
import { z as z5 } from "zod";
var GanttPropsSchema = z5.object({
  title: z5.string().nullable(),
  tasks: z5.array(ganttTaskSchema).min(1).describe("Tasks (REQUIRED, min 1)"),
  lock: z5.boolean().nullable()
});
var GanttDefinition = {
  name: "Gantt",
  props: GanttPropsSchema,
  description: "Gantt chart for project timelines and dependencies.",
  hasChildren: true
};
export {
  Chart,
  ChartDefinition,
  ChartPropsSchema,
  Gantt,
  GanttDefinition,
  GanttPropsSchema,
  Graph,
  GraphDefinition,
  GraphPropsSchema,
  MindMap,
  MindMapDefinition,
  MindMapPropsSchema,
  StockChart,
  StockChartDefinition,
  StockChartPropsSchema
};
//# sourceMappingURL=index.mjs.map