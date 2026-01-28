import { z } from "zod";
import { mindMapNodeSchema } from "../../utils/shared-schemas";

/**
 * MindMap component schema definition
 */
export const MindMapPropsSchema = z.object({
  title: z.string().nullable(),
  nodes: z.array(mindMapNodeSchema),
  layout: z.enum(["horizontal", "vertical"]).nullable(),
  expandedByDefault: z.boolean().nullable(),
});

/** Type inference for MindMap props */
export type MindMapProps = z.infer<typeof MindMapPropsSchema>;

/**
 * MindMap component definition for catalog registration
 */
export const MindMapDefinition = {
  name: "MindMap" as const,
  props: MindMapPropsSchema,
  description: "A hierarchical mind map. MUST use ",
  hasChildren: true,
};
