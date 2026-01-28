"use client";

import { memo } from "react";
import { type ComponentRenderProps } from "@onegenui/react";
import { cn } from "../../utils/cn";
import type { GanttProps } from "./schema";

type GanttTask = {
  id: string;
  name: string;
  start: string;
  end: string;
  progress: number;
  dependencies?: string[];
  owner?: string;
  color?: string;
  type?: "task" | "milestone";
};

export const Gantt = memo(function Gantt({
  element,
  children,
}: ComponentRenderProps) {
  const { title, tasks: initialTasks } = element.props as {
    title?: string | null;
    tasks?: GanttTask[] | null;
    lock?: boolean;
  };

  const tasks = initialTasks || [];

  if (tasks.length === 0) return null;

  const dates = tasks
    .flatMap((t) => [new Date(t.start), new Date(t.end)])
    .sort((a, b) => a.getTime() - b.getTime());
  const minDate = dates[0];
  const maxDate = dates[dates.length - 1];

  if (!minDate || !maxDate) return null;

  const totalDuration = maxDate.getTime() - minDate.getTime();

  const getLeft = (dateStr: string) => {
    if (!minDate) return 0;
    const d = new Date(dateStr);
    return ((d.getTime() - minDate.getTime()) / totalDuration) * 100;
  };

  const getWidth = (startStr: string, endStr: string) => {
    const s = new Date(startStr);
    const e = new Date(endStr);
    return ((e.getTime() - s.getTime()) / totalDuration) * 100;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  return (
    <div className="glass-panel bg-card/80 backdrop-blur-md border border-border/50 rounded-xl p-4 overflow-hidden shadow-lg">
      {title && (
        <h3 className="mb-5 text-lg font-bold text-foreground">{title}</h3>
      )}

      <div
        className="relative min-h-[var(--gantt-height)]"
        style={
          {
            "--gantt-height": `${tasks.length * 40 + 40}px`,
          } as React.CSSProperties
        }
      >
        <div className="overflow-x-auto pb-3">
          <div className="min-w-[600px]">
            <div className="flex justify-between mb-3 border-b border-border pb-2 text-xs text-muted-foreground">
              <span>{tasks[0] ? formatDate(tasks[0].start) : ""}</span>
              <span>
                {(() => {
                  const lastTask = tasks[tasks.length - 1];
                  return lastTask ? formatDate(lastTask.end) : "";
                })()}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {tasks.map((task, index) => {
                const paddingLeft = getLeft(task.start);
                const width = getWidth(task.start, task.end);
                const isMilestone = task.type === "milestone" || width === 0;
                const itemId = task.id || `task-${index}`;

                return (
                  <div
                    key={itemId}
                    data-selectable-item
                    data-element-key={element.key}
                    data-item-id={itemId}
                    className="flex items-center h-7 rounded px-1 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-1/5 pr-3 text-[13px] font-medium overflow-hidden text-ellipsis whitespace-nowrap text-foreground">
                      {task.name}
                    </div>

                    <div
                      className={cn(
                        "flex-1 relative h-full rounded",
                        isMilestone ? "bg-transparent" : "bg-muted/30",
                      )}
                    >
                      {isMilestone ? (
                        <div
                          className="absolute w-4 h-4 z-10 border-2 border-white shadow-sm left-[var(--milestone-left)] bg-[var(--milestone-color)] rotate-45 -translate-x-1/2 origin-left"
                          style={
                            {
                              "--milestone-left": `${paddingLeft}%`,
                              "--milestone-color": task.color || "#eab308",
                            } as React.CSSProperties
                          }
                          title={`Milestone: ${task.name}`}
                        />
                      ) : (
                        <div
                          className="absolute h-full rounded opacity-90 flex items-center pl-2 text-white text-[10px] overflow-hidden left-[var(--task-left)] w-[var(--task-width)] bg-[var(--task-color)]"
                          style={
                            {
                              "--task-left": `${paddingLeft}%`,
                              "--task-width": `${width}%`,
                              "--task-color": task.color || "var(--primary)",
                            } as React.CSSProperties
                          }
                          title={`${task.name}: ${task.progress}%`}
                        >
                          {width > 10 && (
                            <span className="z-[2]">{task.progress}%</span>
                          )}

                          <div
                            className="absolute left-0 top-0 bottom-0 bg-white opacity-20 w-[var(--task-progress)]"
                            style={
                              {
                                "--task-progress": `${task.progress}%`,
                              } as React.CSSProperties
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {children && <div className="mt-6 space-y-4">{children}</div>}
    </div>
  );
});
