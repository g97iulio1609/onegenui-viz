import { z } from "zod";
import { graphNodeSchema, graphEdgeSchema } from "../../utils/shared-schemas";

/**
 * Graph component schema definition
 */
export const GraphPropsSchema = z.object({
  title: z.string().nullable(),
  nodes: z.array(graphNodeSchema).nullable(),
  edges: z.array(graphEdgeSchema).nullable(),
  layout: z.enum(["force", "radial", "grid"]).nullable(),
  showLabels: z.boolean().nullable(),
  showEdgeLabels: z.boolean().nullable(),
  allowPanZoom: z.boolean().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  lock: z.boolean().nullable(),
});

/** Type inference for Graph props */
export type GraphProps = z.infer<typeof GraphPropsSchema>;

/**
 * Graph component definition for catalog registration
 */
export const GraphDefinition = {
  name: "Graph" as const,
  props: GraphPropsSchema,
  description:
    "Interactive graph (nodes + edges). IMPORTANT: Provide content via ",
  hasChildren: true,
};
