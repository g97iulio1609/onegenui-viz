"use client";

import { memo, useState, useCallback, useRef, useLayoutEffect } from "react";
import { cn } from "../../../utils/cn";
import { type MindMapNode, getColorForDepth } from "./types";

interface NodeRendererProps {
  node: MindMapNode;
  depth: number;
  isHorizontal: boolean;
  expandedByDefault: boolean;
  elementKey: string;
}

export const NodeRenderer = memo(function NodeRenderer({
  node,
  depth,
  isHorizontal,
  expandedByDefault,
  elementKey,
}: NodeRendererProps) {
  const [expanded, setExpanded] = useState(expandedByDefault);
  const hasChildren = node.children && node.children.length > 0;

  const defaultColors = getColorForDepth(depth);
  const colors = node.color
    ? { bg: `${node.color}15`, border: node.color, text: node.color }
    : defaultColors;

  const nodeRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);

  const updatePaths = useCallback(() => {
    if (!expanded || !hasChildren || !nodeRef.current || !childrenRef.current) {
      setPaths([]);
      return;
    }

    const parentRect = nodeRef.current.getBoundingClientRect();
    const containerRect = childrenRef.current.getBoundingClientRect();
    const childrenNodes = Array.from(
      childrenRef.current.children,
    ) as HTMLElement[];

    const newPaths: string[] = [];
    childrenNodes.forEach((child) => {
      const anchor = child.querySelector("[data-node-anchor]");
      if (!anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      const startY = parentRect.top + parentRect.height / 2 - containerRect.top;
      const endY = anchorRect.top + anchorRect.height / 2 - containerRect.top;
      const width = 64;

      const p1 = { x: 0, y: startY };
      const p2 = { x: width, y: endY };
      const c1 = { x: width * 0.4, y: startY };
      const c2 = { x: width * 0.6, y: endY };

      newPaths.push(
        `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`,
      );
    });

    setPaths(newPaths);
  }, [expanded, hasChildren]);

  useLayoutEffect(() => {
    updatePaths();
    window.addEventListener("resize", updatePaths);
    return () => window.removeEventListener("resize", updatePaths);
  }, [updatePaths]);

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <div
      className={cn(
        "flex relative",
        isHorizontal ? "flex-row items-center" : "flex-col items-center",
      )}
    >
      <div ref={nodeRef} className="relative group z-10 flex items-center">
        <div
          data-node-anchor
          data-selectable-item
          data-element-key={elementKey}
          data-item-id={node.id}
          className={cn(
            "relative border rounded-xl transition-all duration-300 shadow-sm",
            "backdrop-blur-md bg-card/90 border-border hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5",
            "flex items-center gap-3 p-3 min-w-[140px] max-w-[240px]",
            depth === 0
              ? "border-primary/30 bg-primary/5 ring-1 ring-primary/20"
              : "",
          )}
          style={{
            borderColor: colors.border,
            backgroundColor: depth === 0 ? undefined : colors.bg,
          }}
        >
          {node.icon && (
            <span className="text-xl flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-background/50 border border-white/10">
              {node.icon}
            </span>
          )}
          <div className="flex-1 min-w-0">
            <div
              className={cn(
                "font-semibold leading-tight truncate",
                depth === 0 ? "text-[15px]" : "text-[13px]",
              )}
              style={{ color: depth === 0 ? undefined : colors.text }}
            >
              {node.label}
            </div>
            {node.description && (
              <div className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                {node.description}
              </div>
            )}
          </div>
        </div>

        {hasChildren && (
          <button
            onClick={toggleExpand}
            className={cn(
              "ml-[-10px] z-20 w-6 h-6 rounded-full flex items-center justify-center",
              "bg-background border border-border shadow-sm hover:scale-110 transition-transform",
              "text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer",
            )}
            style={{
              marginLeft: -12,
              marginRight: -12,
              position: "relative",
              left: 12,
            }}
          >
            {expanded ? "−" : "+"}
          </button>
        )}
      </div>

      {hasChildren && expanded && (
        <div className="flex flex-row items-stretch">
          {isHorizontal && (
            <div className="w-16 relative shrink-0">
              <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none">
                {paths.map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke="hsl(var(--border))"
                    strokeWidth="1.5"
                    opacity="0.5"
                    className="transition-all duration-500"
                  />
                ))}
              </svg>
            </div>
          )}
          <div
            ref={childrenRef}
            className={cn(
              "flex",
              isHorizontal ? "flex-col gap-4 py-2" : "flex-row gap-4",
            )}
          >
            {node.children!.map((child) => (
              <NodeRenderer
                key={child.id}
                node={child}
                depth={depth + 1}
                isHorizontal={isHorizontal}
                expandedByDefault={expandedByDefault}
                elementKey={elementKey}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
