# AGENTS.md - @onegenui/viz

Advanced data visualization components for OneGenUI.

## Purpose

This package provides specialized visualization components:
- **Charts**: Line, Bar, Area, Pie (using Recharts)
- **Graphs**: Network graphs, tree visualizations
- **Financial**: Stock charts, candlestick (using lightweight-charts)
- **Other**: MindMap, Gantt, Timeline

## File Structure

```
src/
├── index.ts              # Public exports
├── charts/               # Recharts-based components
│   ├── LineChart/
│   ├── BarChart/
│   ├── AreaChart/
│   └── PieChart/
├── graphs/               # Network/tree visualizations
│   └── Graph/
└── utils/                # Shared utilities
```

## Key Exports

```typescript
export * from './charts';
export * from './graphs';

// Component definitions
export { vizDefinitions } from './definitions';
```

## Component Pattern

```typescript
// schema.ts
export const LineChartPropsSchema = z.object({
  data: z.array(z.record(z.unknown())),
  xKey: z.string(),
  yKeys: z.array(z.string()),
  title: z.string().optional(),
});

export const LineChartDefinition = {
  name: 'LineChart' as const,
  props: LineChartPropsSchema,
  description: 'Line chart for time series data',
  hasChildren: false,
};

// component.tsx
export const LineChart = memo(function LineChart({ element }: ComponentRenderProps) {
  const { data, xKey, yKeys } = element.props as LineChartProps;
  return (
    <ResponsiveContainer>
      <RechartsLineChart data={data}>
        {/* ... */}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
});
```

## Development Guidelines

- Use responsive containers for all charts
- Support theme integration (dark/light mode)
- Handle empty data states gracefully
- Provide sensible defaults for all configuration
- Use `memo()` to prevent unnecessary re-renders

## Refactoring Priorities (from toBeta.md)

| File | LOC | Priority |
|------|-----|----------|
| `graphs/Graph/component.tsx` | 481 | P2 |

## Future: Package Consolidation

From `toBeta.md`, this package will be merged into `@onegenui/ui`:

```
@onegenui/ui (consolidated)
├── primitives/     # From current ui package
├── domain/         # From components package
└── visualization/  # This package (viz)
```

## Testing

```bash
pnpm --filter @onegenui/viz type-check
pnpm --filter @onegenui/viz build
```

## Dependencies

- `@onegenui/core` (workspace)
- `@onegenui/react` (workspace)
- `zod` ^4.0.0
- React ^19.0.0 (peer)
- `lightweight-charts` ^5.0.0 (peer)
- `lucide-react` (peer)
