# Gantt

## Purpose

Project timeline visualization with task bars showing start/end dates and dependencies.

## When to Use

- Project schedules and timelines
- Task planning with dates and durations
- Dependency visualization
- Resource allocation over time

## Props Reference

| Prop  | Type    | Required | Description           |
| ----- | ------- | -------- | --------------------- |
| title | string  | No       | Chart title           |
| tasks | array   | Yes      | List of tasks (min 1) |
| lock  | boolean | No       | Lock editing          |

### Task Structure

```typescript
{
  id: string;            // Unique ID (REQUIRED)
  name: string;          // Task name (REQUIRED)
  start: string;         // Start date ISO (REQUIRED)
  end: string;           // End date ISO (REQUIRED)
  progress?: number;     // Completion percentage (0-100)
  dependencies?: string[];// IDs of prerequisite tasks
  subTasks?: Task[];     // Nested subtasks
}
```

## AI Generation Rules

1. ALWAYS use Gantt for project timelines with dates
2. Each task MUST have id, name, start, end dates
3. Use ISO date format: "2024-01-15"
4. Set realistic date ranges and dependencies
5. Use progress for ongoing/partial tasks

## Streaming Strategy

```jsonl
{"op":"add","path":"/elements/gantt1","value":{"key":"gantt1","type":"Gantt","props":{"title":"Project Timeline","tasks":[]},"children":[]}}
{"op":"add","path":"/elements/gantt1/props/tasks/-","value":{"id":"t1","name":"Planning","start":"2024-01-01","end":"2024-01-15","progress":100}}
{"op":"add","path":"/elements/gantt1/props/tasks/-","value":{"id":"t2","name":"Design","start":"2024-01-10","end":"2024-01-31","progress":75,"dependencies":["t1"]}}
{"op":"add","path":"/elements/gantt1/props/tasks/-","value":{"id":"t3","name":"Development","start":"2024-02-01","end":"2024-03-15","progress":30,"dependencies":["t2"]}}
```

## Examples

```json
{
  "type": "Gantt",
  "props": {
    "title": "Website Redesign Project",
    "tasks": [
      {
        "id": "phase1",
        "name": "Discovery & Research",
        "start": "2024-01-08",
        "end": "2024-01-19",
        "progress": 100
      },
      {
        "id": "phase2",
        "name": "UX Design",
        "start": "2024-01-15",
        "end": "2024-02-02",
        "progress": 80,
        "dependencies": ["phase1"]
      },
      {
        "id": "phase3",
        "name": "Visual Design",
        "start": "2024-01-29",
        "end": "2024-02-16",
        "progress": 50,
        "dependencies": ["phase2"]
      },
      {
        "id": "phase4",
        "name": "Development",
        "start": "2024-02-12",
        "end": "2024-03-22",
        "progress": 0,
        "dependencies": ["phase3"]
      },
      {
        "id": "phase5",
        "name": "Testing & Launch",
        "start": "2024-03-18",
        "end": "2024-03-29",
        "progress": 0,
        "dependencies": ["phase4"]
      }
    ]
  }
}
```
