import { memo } from "react";
import type { GraphEdge, NodeState } from "./types";
import { getIntersection } from "./types";

interface EdgesRendererProps {
  edges: GraphEdge[];
  nodeStates: Map<string, NodeState>;
}

export const EdgesRenderer = memo(function EdgesRenderer({
  edges,
  nodeStates,
}: EdgesRendererProps) {
  return (
    <>
      {edges.map((e, i) => {
        const u = nodeStates.get(e.source);
        const v = nodeStates.get(e.target);
        if (!u || !v) return null;

        const targetRadius = v.size + 4;
        const end = getIntersection(u.pos, v.pos, targetRadius);

        return (
          <g key={`${e.source}-${e.target}-${i}`}>
            <line
              x1={u.pos.x}
              y1={u.pos.y}
              x2={end.x}
              y2={end.y}
              stroke="var(--border)"
              strokeWidth={2}
              opacity={0.6}
              markerEnd="url(#arrow)"
            />
          </g>
        );
      })}
    </>
  );
});
