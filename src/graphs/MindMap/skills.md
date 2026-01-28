# MindMap

## Purpose

Visualize hierarchical/tree-structured information as an interactive mind map.

## When to Use

- Brainstorming and idea organization
- Topic hierarchies and taxonomies
- Concept breakdowns
- Knowledge structures

## Props Reference

| Prop              | Type                       | Required | Description               |
| ----------------- | -------------------------- | -------- | ------------------------- |
| title             | string                     | No       | Mind map title            |
| nodes             | array                      | Yes      | Root-level nodes          |
| layout            | "horizontal" \| "vertical" | No       | Layout direction          |
| expandedByDefault | boolean                    | No       | Start with nodes expanded |

### Node Structure (RECURSIVE)

```typescript
{
  id: string;          // Unique ID (REQUIRED)
  label: string;       // Node text (REQUIRED)
  description?: string;// Additional details
  color?: string;      // Node color
  icon?: string;       // Icon name
  children?: Node[];   // Nested child nodes
}
```

## AI Generation Rules

1. CRITICAL: Use RECURSIVE 'children' array INSIDE each node - NOT a flat edges array
2. Always start with a single root node
3. Each node MUST have id and label
4. Use meaningful, hierarchical structure
4. Use meaningful, hierarchical structure

## Streaming Strategy

```jsonl
{"op":"add","path":"/elements/map1","value":{"key":"map1","type":"MindMap","props":{"title":"Project Structure","nodes":[]},"children":[]}}
{"op":"add","path":"/elements/map1/props/nodes/-","value":{"id":"root","label":"Main Topic","children":[]}}
{"op":"add","path":"/elements/map1/props/nodes/0/children/-","value":{"id":"sub1","label":"Subtopic 1","children":[]}}
{"op":"add","path":"/elements/map1/props/nodes/0/children/-","value":{"id":"sub2","label":"Subtopic 2","children":[]}}
{"op":"add","path":"/elements/map1/props/nodes/0/children/0/children/-","value":{"id":"leaf1","label":"Detail 1"}}
```

## Examples

```json
{
  "type": "MindMap",
  "props": {
    "title": "Web Development",
    "layout": "horizontal",
    "expandedByDefault": true,
    "nodes": [
      {
        "id": "root",
        "label": "Web Development",
        "children": [
          {
            "id": "frontend",
            "label": "Frontend",
            "children": [
              { "id": "html", "label": "HTML" },
              { "id": "css", "label": "CSS" },
              { "id": "js", "label": "JavaScript" }
            ]
          },
          {
            "id": "backend",
            "label": "Backend",
            "children": [
              { "id": "node", "label": "Node.js" },
              { "id": "python", "label": "Python" },
              { "id": "go", "label": "Go" }
            ]
          }
        ]
      }
    ]
  }
}
```
