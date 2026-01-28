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
      <div className="p-4 sm:p-8 text-center text-muted-foreground bg-muted/20 rounded-lg sm:rounded-xl border border-dashed border-border text-sm">
        No mind map data
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden">
      {title && (
        <h3 className="mb-2 sm:mb-4 text-base sm:text-lg font-semibold text-foreground flex items-center gap-2">
          {title}
        </h3>
      )}

      <div
        className={cn(
          "flex p-4 sm:p-6 lg:p-8 gap-6 sm:gap-8 lg:gap-12 overflow-auto glass-subtle rounded-lg sm:rounded-2xl min-h-[250px] sm:min-h-[350px] lg:min-h-[400px] touch-pan-x touch-pan-y",
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
