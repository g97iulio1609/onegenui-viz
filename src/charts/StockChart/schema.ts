import { z } from "zod";

/**
 * OHLC (Open, High, Low, Close) data point schema
 */
export const ohlcSchema = z.object({
  time: z.string().describe("Date in YYYY-MM-DD format"),
  open: z.number().describe("Opening price"),
  high: z.number().describe("Highest price"),
  low: z.number().describe("Lowest price"),
  close: z.number().describe("Closing price"),
  volume: z.number().nullable().optional().describe("Trading volume"),
});

/**
 * Stock series schema - represents a single stock/instrument
 */
export const stockSeriesSchema = z.object({
  symbol: z.string().describe("Stock ticker symbol (e.g., AAPL, GOOGL)"),
  name: z.string().describe("Full company/instrument name"),
  color: z.string().describe("Hex color for the series line (e.g., #3b82f6)"),
  data: z.array(ohlcSchema).describe("Array of OHLC data points"),
});

/**
 * Technical level schema - support/resistance lines
 */
export const technicalLevelSchema = z.object({
  price: z.number().describe("Price level"),
  type: z.enum(["support", "resistance"]).describe("Type of technical level"),
  strength: z
    .number()
    .nullable()
    .optional()
    .describe("Strength indicator (0-1)"),
  label: z
    .string()
    .nullable()
    .optional()
    .describe("Custom label for the level"),
});

/**
 * Timeframe options for filtering data
 */
export const timeframeSchema = z
  .enum(["1D", "1W", "1M", "3M", "1Y", "5Y", "10Y", "ALL"])
  .describe("Time period to display");

/**
 * StockChart component schema definition
 */
export const StockChartPropsSchema = z.object({
  title: z.string().nullable().optional().describe("Chart title"),
  series: z
    .array(stockSeriesSchema)
    .nullable()
    .optional()
    .describe("Array of stock series to display"),
  levels: z
    .array(technicalLevelSchema)
    .nullable()
    .optional()
    .describe("Technical support/resistance levels"),
  chartType: z
    .enum(["Line", "Candlestick"])
    .nullable()
    .optional()
    .describe("Chart visualization type"),
  timeframe: timeframeSchema
    .nullable()
    .optional()
    .describe("Initial timeframe selection"),
  height: z
    .number()
    .nullable()
    .optional()
    .describe("Chart height in pixels (default: 400)"),
  showLevels: z
    .boolean()
    .nullable()
    .optional()
    .describe("Show support/resistance levels (default: true)"),
  showVolume: z
    .boolean()
    .nullable()
    .optional()
    .describe("Show volume bars (default: false)"),
});

/** Type inference for StockChart props */
export type StockChartProps = z.infer<typeof StockChartPropsSchema>;

/** Type inference for OHLC data */
export type OHLCData = z.infer<typeof ohlcSchema>;

/** Type inference for stock series */
export type StockSeries = z.infer<typeof stockSeriesSchema>;

/** Type inference for technical level */
export type TechnicalLevel = z.infer<typeof technicalLevelSchema>;

/** Type inference for timeframe */
export type Timeframe = z.infer<typeof timeframeSchema>;

/**
 * StockChart component definition for catalog registration
 */
export const StockChartDefinition = {
  name: "StockChart" as const,
  props: StockChartPropsSchema,
  description:
    "Interactive financial chart with candlestick/line views, multiple series comparison, and technical levels",
  hasChildren: false,
};
