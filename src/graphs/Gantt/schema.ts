import { z } from "zod";
import { ganttTaskSchema } from "../../utils/shared-schemas";

/**
 * Gantt component schema definition
 */
export const GanttPropsSchema = z.object({
  title: z.string().nullable(),
  tasks: z.array(ganttTaskSchema).min(1).describe("Tasks (REQUIRED, min 1)"),
  lock: z.boolean().nullable(),
});

/** Type inference for Gantt props */
export type GanttProps = z.infer<typeof GanttPropsSchema>;

/**
 * Gantt component definition for catalog registration
 */
export const GanttDefinition = {
  name: "Gantt" as const,
  props: GanttPropsSchema,
  description: "Gantt chart for project timelines and dependencies.",
  hasChildren: true,
};
