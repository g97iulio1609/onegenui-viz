"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { type ComponentRenderProps, useSelection } from "@onegenui/react";
import { cn } from "../../utils/cn";
import {
  type Vec2,
  type GraphProps,
  type NodeState,
  MAG,
  SUB,
  ADD,
  MUL,
  NORM,
  DEFAULT_H,
  REPULSION,
  SPRING_LEN,
  SPRING_K,
  DAMPING,
  CENTER_PULL,
  DT,
  MAX_ITERATIONS,
  EdgesRenderer,
  NodesRenderer,
} from "./components";

export const Graph = memo(function Graph({
  element,
  children,
}: ComponentRenderProps) {
  const {
    title,
    nodes: propsNodes,
    edges: propsEdges,
    height,
  } = element.props as GraphProps;

  const nodes = useMemo(
    () => (propsNodes || []).filter((n) => !!n?.id),
    [propsNodes],
  );
  const edges = useMemo(
    () => (propsEdges || []).filter((e) => !!e.source && !!e.target),
    [propsEdges],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ w: 800, h: DEFAULT_H });

  const nodeStates = useRef<Map<string, NodeState>>(new Map());
  const rafRef = useRef<number | undefined>(undefined);
  const [bump, setBump] = useState(0);
  const iterationCount = useRef(0);

  const { isSelected, toggleSelection } = useSelection();
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const isDragging = useRef(false);
  const dragNodeId = useRef<string | null>(null);
  const lastMousePos = useRef<Vec2>({ x: 0, y: 0 });

  // Initialize Physics
  useEffect(() => {
    const w = containerRef.current?.clientWidth || 800;
    const h = Math.max(240, height ?? DEFAULT_H);
    setDimensions({ w, h });

    const map = new Map<string, NodeState>();
    const count = nodes.length;

    nodes.forEach((n, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = count * 10;
      const baseSize = 20;
      const labelFactor = (n.label?.length || 0) * 2;
      const size = Math.max(
        28,
        Math.min(60, baseSize + (n.value || 0) + labelFactor * 0.3),
      );

      map.set(n.id, {
        pos: {
          x: w / 2 + Math.cos(angle) * radius,
          y: h / 2 + Math.sin(angle) * radius,
        },
        vel: { x: 0, y: 0 },
        acc: { x: 0, y: 0 },
        mass: 1,
        size: size,
      });
    });

    nodeStates.current = map;
    iterationCount.current = 0;
    setBump((b) => b + 1);
  }, [nodes, height]);

  // Physics Loop
  useEffect(() => {
    const center = { x: dimensions.w / 2, y: dimensions.h / 2 };

    const step = () => {
      if (iterationCount.current > MAX_ITERATIONS && !isDragging.current) {
        return;
      }

      const st = nodeStates.current;
      const nodeIds = Array.from(st.keys());

      for (let i = 0; i < nodeIds.length; i++) {
        const nodeIdI = nodeIds[i];
        if (!nodeIdI) continue;
        const u = st.get(nodeIdI)!;
        u.acc = { x: 0, y: 0 };

        const toCenter = SUB(center, u.pos);
        u.acc = ADD(u.acc, MUL(toCenter, CENTER_PULL));

        for (let j = i + 1; j < nodeIds.length; j++) {
          const nodeIdJ = nodeIds[j];
          if (!nodeIdJ) continue;
          const v = st.get(nodeIdJ)!;
          const delta = SUB(u.pos, v.pos);
          const dist = MAG(delta) || 0.1;

          if (dist < 500) {
            const force = (REPULSION * 5) / (dist * dist);
            const dir = NORM(delta);
            u.acc = ADD(u.acc, MUL(dir, force));
            v.acc = ADD(v.acc, MUL(dir, -force));
          }

          const minDist = u.size + v.size + 10;
          if (dist < minDist) {
            const overlap = minDist - dist;
            const dir = NORM(delta);
            const separate = MUL(dir, overlap * 0.5);
            u.pos = ADD(u.pos, separate);
            v.pos = SUB(v.pos, separate);
          }
        }
      }

      edges.forEach((e) => {
        const u = st.get(e.source);
        const v = st.get(e.target);
        if (u && v) {
          const delta = SUB(v.pos, u.pos);
          const dist = MAG(delta) || 1;
          const force = (dist - SPRING_LEN) * SPRING_K;
          const dir = NORM(delta);
          u.acc = ADD(u.acc, MUL(dir, force));
          v.acc = ADD(v.acc, MUL(dir, -force));
        }
      });

      st.forEach((n, id) => {
        if (id !== dragNodeId.current) {
          n.vel = ADD(n.vel, MUL(n.acc, DT));
          n.vel = MUL(n.vel, DAMPING);
          n.pos = ADD(n.pos, MUL(n.vel, DT));
        }
      });

      iterationCount.current++;
      setBump((b) => b + 1);
      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [edges, dimensions, nodes]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.stopPropagation();
    const d = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom((z) => Math.max(0.1, Math.min(5, z * d)));
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      e.stopPropagation();

      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      if (dragNodeId.current) {
        const st = nodeStates.current.get(dragNodeId.current);
        if (st) {
          st.pos.x += dx / zoom;
          st.pos.y += dy / zoom;
          st.vel = { x: 0, y: 0 };
          iterationCount.current = 0;
        }
      } else {
        setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
      }
    },
    [zoom],
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);
    isDragging.current = false;
    dragNodeId.current = null;
  }, []);

  const handleNodeDragStart = useCallback(
    (nodeId: string, e: React.PointerEvent) => {
      isDragging.current = true;
      dragNodeId.current = nodeId;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    },
    [],
  );

  const renderedEdges = useMemo(
    () => <EdgesRenderer edges={edges} nodeStates={nodeStates.current} />,
    [edges, bump],
  );

  const renderedNodes = useMemo(
    () => (
      <NodesRenderer
        nodes={nodes}
        nodeStates={nodeStates.current}
        elementKey={element.key}
        isSelected={isSelected}
        toggleSelection={toggleSelection}
        onNodeDragStart={handleNodeDragStart}
      />
    ),
    [
      nodes,
      bump,
      isSelected,
      element.key,
      toggleSelection,
      handleNodeDragStart,
    ],
  );

  return (
    <div
      ref={containerRef}
      style={
        {
          "--graph-height": `${Math.max(240, height ?? DEFAULT_H)}px`,
        } as React.CSSProperties
      }
      className={cn(
        "relative w-full overflow-hidden rounded-xl border border-border/50 glass-panel bg-card/80 backdrop-blur-md touch-none select-none h-[var(--graph-height)] shadow-lg",
      )}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {title && (
        <div className="absolute top-4 left-4 z-10 bg-background px-2 py-1 rounded border border-border font-semibold text-sm shadow-sm">
          {title}
        </div>
      )}

      <div className="absolute bottom-2.5 right-2.5 text-[10px] text-muted-foreground z-10">
        Zoom: {Math.round(zoom * 100)}%
      </div>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
        className="block"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
          </marker>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {renderedEdges}
          {renderedNodes}
        </g>
      </svg>
      {children}
    </div>
  );
});
