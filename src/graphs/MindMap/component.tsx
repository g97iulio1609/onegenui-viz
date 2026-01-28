"use client";

import { memo, useMemo } from "react";
import { type ComponentRenderProps } from "@onegenui/react";
import { cn } from "../../utils/cn";
import {
  type MindMapProps,
  buildTreeFromFlat,
  NodeRenderer,
} from "./components";

export const MindMap = memo(function MindMap({
  element,
  children,
}: ComponentRenderProps) {
  const { title, nodes, layout, expandedByDefault } =
    element.props as MindMapProps;

  const isHorizontal = layout !== "vertical";
  const defaultExpanded = expandedByDefault !== false;

  const rootNodes = useMemo(() => {
    if (!nodes || !Array.isArray(nodes)) return [];
    return buildTreeFromFlat(nodes);
  }, [nodes]);

  if (!rootNodes.length) {
    return (
      <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
        No mind map data
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          {title}
        </h3>
      )}

      <div
        className={cn(
          "flex p-8 gap-12 overflow-auto glass-subtle rounded-2xl min-h-[400px]",
          isHorizontal ? "flex-col" : "flex-row",
        )}
      >
        {rootNodes.map((node) => (
          <NodeRenderer
            key={node.id}
            node={node}
            depth={0}
            isHorizontal={isHorizontal}
            expandedByDefault={defaultExpanded}
            elementKey={element.key}
          />
        ))}
      </div>

      {children}
    </div>
  );
});
