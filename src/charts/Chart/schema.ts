import { z } from "zod";
import { chartDatumSchema } from "../../utils/shared-schemas";

const seriesSchema = z.object({
  name: z.string(),
  data: z.array(z.number()),
  color: z.string().nullable(),
});

/**
 * Chart component schema definition
 */
export const ChartPropsSchema = z.object({
  title: z.string().nullable(),
  data: z.array(chartDatumSchema).nullable(),
  dataPath: z.string().nullable(),
  height: z.number().nullable(),
  // Multi-series support
  series: z.array(seriesSchema).nullable(),
  categories: z.array(z.string()).nullable(),
});

/** Type inference for Chart props */
export type ChartProps = z.infer<typeof ChartPropsSchema>;

/**
 * Chart component definition for catalog registration
 */
export const ChartDefinition = {
  name: "Chart" as const,
  props: ChartPropsSchema,
  description: "Display a chart from array data",
  hasChildren: true,
};
