/**
 * MindMap types and utilities
 */

export interface MindMapNode {
  id: string;
  label: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  children?: MindMapNode[] | null;
  parentId?: string | null;
}

export interface MindMapProps {
  title?: string | null;
  nodes?: MindMapNode[] | null;
  layout?: "horizontal" | "vertical" | null;
  expandedByDefault?: boolean | null;
}

export interface NodeColors {
  bg: string;
  border: string;
  text: string;
}

export const DEPTH_COLORS: NodeColors[] = [
  { bg: "rgba(59, 130, 246, 0.1)", border: "#3b82f6", text: "#60a5fa" },
  { bg: "rgba(168, 85, 247, 0.1)", border: "#a855f7", text: "#c084fc" },
  { bg: "rgba(34, 197, 94, 0.1)", border: "#22c55e", text: "#4ade80" },
  { bg: "rgba(249, 115, 22, 0.1)", border: "#f97316", text: "#fb923c" },
  { bg: "rgba(236, 72, 153, 0.1)", border: "#ec4899", text: "#f472b6" },
  { bg: "rgba(20, 184, 166, 0.1)", border: "#14b8a6", text: "#2dd4bf" },
];

export function getColorForDepth(depth: number): NodeColors {
  return DEPTH_COLORS[depth % DEPTH_COLORS.length] as NodeColors;
}

export function buildTreeFromFlat(nodes: MindMapNode[]): MindMapNode[] {
  if (!Array.isArray(nodes)) return [];

  const nodeMap = new Map<string, MindMapNode>();
  const roots: MindMapNode[] = [];

  nodes.forEach((n) => {
    nodeMap.set(n.id, { ...n, children: n.children ? [...n.children] : [] });
  });

  nodes.forEach((n) => {
    const node = nodeMap.get(n.id)!;
    const parentId = n.parentId || (n as any).parent;

    if (parentId && nodeMap.has(parentId)) {
      const parent = nodeMap.get(parentId)!;
      parent.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots.length > 0 ? roots : nodes;
}
