# StockChart

## Purpose

Interactive financial chart for displaying stock prices, comparing multiple securities, and visualizing technical analysis levels. Supports both line charts and candlestick charts with time-based filtering.

## AI Generation Rules

- Always provide `series` array with at least one stock
- Each series must have `symbol`, `name`, `color`, and `data` array
- Data must be in chronological order with `time` in "YYYY-MM-DD" format
- Use distinct colors for each series (suggested: #3b82f6, #22c55e, #f59e0b, #ef4444)
- Use `chartType: "Candlestick"` for single-stock technical analysis
- Use `chartType: "Line"` when comparing multiple stocks
- Technical levels should have meaningful price points (not arbitrary)
- Default height is 400px; use 500-600 for detailed analysis views

## Data Format

```typescript
{
  series: [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      color: "#3b82f6",
      data: [
        { time: "2024-01-02", open: 185.0, high: 186.5, low: 184.0, close: 185.5, volume: 50000000 },
        // ... more data points
      ]
    }
  ],
  levels: [
    { price: 190.0, type: "resistance", label: "52W High" },
    { price: 170.0, type: "support", label: "Moving Average" }
  ]
}
```

## Examples

- Single stock with candlestick chart and support/resistance levels
- Multiple stocks comparison (line chart, same timeframe)
- Index comparison (S&P 500 vs NASDAQ)
- Sector analysis with multiple tickers

## Streaming Strategy

1. Start with `title` and chart configuration (`chartType`, `timeframe`, `height`)
2. Add series one at a time with their metadata (`symbol`, `name`, `color`)
3. Progressively stream data points within each series
4. Add technical levels after all series data is complete

## Anti-patterns

- Do not mix candlestick with multi-series comparison (only first series shows candles)
- Do not use random/placeholder data - use realistic market-like values
- Do not set levels outside the visible price range
- Do not use unsorted date data (must be chronological)
