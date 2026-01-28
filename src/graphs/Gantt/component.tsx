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
    <div className="glass-panel bg-card/80 backdrop-blur-md border border-border/50 rounded-lg sm:rounded-xl p-3 sm:p-4 overflow-hidden shadow-lg">
      {title && (
        <h3 className="mb-3 sm:mb-5 text-base sm:text-lg font-bold text-foreground">{title}</h3>
      )}

      <div
        className="relative"
        style={{
          minHeight: `${tasks.length * 36 + 40}px`,
        }}
      >
        <div className="overflow-x-auto pb-2 sm:pb-3 touch-pan-x">
          <div className="min-w-[400px] sm:min-w-[600px]">
            <div className="flex justify-between mb-2 sm:mb-3 border-b border-border pb-1.5 sm:pb-2 text-[0.625rem] sm:text-xs text-muted-foreground">
              <span>{tasks[0] ? formatDate(tasks[0].start) : ""}</span>
              <span>
                {(() => {
                  const lastTask = tasks[tasks.length - 1];
                  return lastTask ? formatDate(lastTask.end) : "";
                })()}
              </span>
            </div>

            <div className="flex flex-col gap-2 sm:gap-3">
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
                    className="flex items-center h-6 sm:h-7 rounded px-0.5 sm:px-1 cursor-pointer hover:bg-muted/50 transition-colors touch-manipulation"
                  >
                    <div className="w-1/4 sm:w-1/5 pr-1.5 sm:pr-3 text-[0.625rem] sm:text-[0.8125rem] font-medium overflow-hidden text-ellipsis whitespace-nowrap text-foreground">
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
                          className="absolute w-3 h-3 sm:w-4 sm:h-4 z-10 border-2 border-white shadow-sm rotate-45 -translate-x-1/2 origin-left"
                          style={{
                            left: `${paddingLeft}%`,
                            backgroundColor: task.color || "#eab308",
                          }}
                          title={`Milestone: ${task.name}`}
                        />
                      ) : (
                        <div
                          className="absolute h-full rounded opacity-90 flex items-center pl-1.5 sm:pl-2 text-white text-[0.5rem] sm:text-[0.625rem] overflow-hidden"
                          style={{
                            left: `${paddingLeft}%`,
                            width: `${width}%`,
                            backgroundColor: task.color || "var(--primary)",
                          }}
                          title={`${task.name}: ${task.progress}%`}
                        >
                          {width > 10 && (
                            <span className="z-[2]">{task.progress}%</span>
                          )}

                          <div
                            className="absolute left-0 top-0 bottom-0 bg-white opacity-20"
                            style={{
                              width: `${task.progress}%`,
                            }}
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

      {children && <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">{children}</div>}
    </div>
  );
});
