export type Vec2 = { x: number; y: number };

export interface GraphNode {
  id: string;
  label?: string;
  group?: string;
  value?: number;
  color?: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  value?: number;
}

export interface GraphProps {
  title?: string;
  nodes?: GraphNode[];
  edges?: GraphEdge[];
  height?: number;
  layout?: "force" | "grid" | "circle";
}

export interface NodeState {
  pos: Vec2;
  vel: Vec2;
  acc: Vec2;
  mass: number;
  size: number;
}

// Math Helpers
export const MAG = (v: Vec2) => Math.sqrt(v.x * v.x + v.y * v.y);
export const SUB = (a: Vec2, b: Vec2) => ({ x: a.x - b.x, y: a.y - b.y });
export const ADD = (a: Vec2, b: Vec2) => ({ x: a.x + b.x, y: a.y + b.y });
export const MUL = (v: Vec2, s: number) => ({ x: v.x * s, y: v.y * s });
export const NORM = (v: Vec2) => {
  const m = MAG(v);
  return m === 0 ? { x: 0, y: 0 } : { x: v.x / m, y: v.y / m };
};

// Intersection for arrow rendering
export function getIntersection(p1: Vec2, p2: Vec2, r2: number): Vec2 {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  return {
    x: p2.x - (dx / len) * r2,
    y: p2.y - (dy / len) * r2,
  };
}

// Generate deterministic colors
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

const PALETTE = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
];

export function colorForGroup(group?: string): string {
  if (!group) return "var(--primary)";
  const idx = Math.abs(hashString(group)) % PALETTE.length;
  return PALETTE[idx] ?? "var(--primary)";
}

// Simulation Constants
export const DEFAULT_H = 400;
export const REPULSION = 800;
export const SPRING_LEN = 120;
export const SPRING_K = 0.05;
export const DAMPING = 0.85;
export const CENTER_PULL = 0.02;
export const DT = 0.1;
export const MAX_ITERATIONS = 300;
