# Chart

## Purpose

Visualize numerical data as bar charts with labels and colors.

## When to Use

- Display comparative data (sales by region, scores by category)
- Show distribution or ranking information
- Visualize metrics over categories

## Props Reference

| Prop     | Type   | Required | Description                             |
| -------- | ------ | -------- | --------------------------------------- |
| title    | string | No       | Chart title                             |
| data     | array  | Yes\*    | Chart data points                       |
| dataPath | string | No       | Data binding path (alternative to data) |
| height   | number | No       | Chart height in pixels                  |

### Data Item Structure

```typescript
{
  label: string;    // Category name
  value: number;    // Numeric value
  color?: string;   // Optional bar color (hex)
}
```

## AI Generation Rules

1. Prefer direct data prop over dataPath for static displays
2. Include 3-8 data points for readability
3. Use semantic colors when categories have meaning (red for danger, green for success)
4. Set height only if default doesn't fit the layout

## Streaming Strategy

```jsonl
{"op":"add","path":"/elements/chart1","value":{"key":"chart1","type":"Chart","props":{"title":"Sales by Region","data":[]},"children":[]}}
{"op":"add","path":"/elements/chart1/props/data/-","value":{"label":"North","value":45000,"color":"#3b82f6"}}
{"op":"add","path":"/elements/chart1/props/data/-","value":{"label":"South","value":32000,"color":"#10b981"}}
{"op":"add","path":"/elements/chart1/props/data/-","value":{"label":"East","value":28000,"color":"#f59e0b"}}
```

## Examples

```json
{
  "type": "Chart",
  "props": {
    "title": "Q4 Revenue by Product",
    "height": 300,
    "data": [
      { "label": "Software", "value": 125000, "color": "#3b82f6" },
      { "label": "Hardware", "value": 89000, "color": "#10b981" },
      { "label": "Services", "value": 67000, "color": "#f59e0b" }
    ]
  }
}
```
