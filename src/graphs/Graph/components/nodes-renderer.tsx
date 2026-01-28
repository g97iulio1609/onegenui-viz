import { memo } from "react";
import type { GraphNode, NodeState, Vec2 } from "./types";
import { colorForGroup } from "./types";

interface NodesRendererProps {
  nodes: GraphNode[];
  nodeStates: Map<string, NodeState>;
  elementKey: string;
  isSelected: (elementKey: string, itemId: string) => boolean;
  toggleSelection: (elementKey: string, itemId: string) => void;
  onNodeDragStart: (nodeId: string, e: React.PointerEvent) => void;
}

export const NodesRenderer = memo(function NodesRenderer({
  nodes,
  nodeStates,
  elementKey,
  isSelected,
  toggleSelection,
  onNodeDragStart,
}: NodesRendererProps) {
  return (
    <>
      {nodes.map((n) => {
        const s = nodeStates.get(n.id);
        if (!s) return null;

        const selected = isSelected(elementKey, n.id);
        const color = n.color || colorForGroup(n.group);

        return (
          <g
            key={n.id}
            transform={`translate(${s.pos.x}, ${s.pos.y})`}
            onPointerDown={(e) => {
              e.stopPropagation();
              onNodeDragStart(n.id, e);
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleSelection(elementKey, n.id);
            }}
            className="cursor-grab active:cursor-grabbing"
          >
            <circle
              r={s.size}
              fill="var(--background)"
              stroke={selected ? "var(--primary)" : color}
              strokeWidth={selected ? 3 : 2}
              className="transition-[stroke-width] duration-200"
            />
            <circle r={s.size} fill={color} opacity={selected ? 0.2 : 0.1} />

            <foreignObject
              x={-s.size * 1.5}
              y={-10}
              width={s.size * 3}
              height={30}
              className="pointer-events-none overflow-visible"
            >
              <div className="flex justify-center items-center h-full">
                <span className="px-1.5 py-0.5 rounded-md text-xs font-medium text-black border border-black/10 whitespace-nowrap shadow-sm bg-white/85">
                  {n.label}
                </span>
              </div>
            </foreignObject>
          </g>
        );
      })}
    </>
  );
});
