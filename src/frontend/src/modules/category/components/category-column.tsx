"use client";

import type { Category, Task } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TaskCard } from "../../../components/features/board/task-card";

interface CategoryColumnProps {
  category: Category;
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
}

export function CategoryColumn({
  category,
  tasks,
  onEditTask,
  onDeleteTask,
}: CategoryColumnProps) {
  return (
    <div className="flex-shrink-0 w-80">
      <Card className="bg-card h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-card-foreground">
              {category.name}
            </h2>
            <Badge variant="secondary" className="text-xs">
              {tasks.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-[70vh] overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No tasks in this category.</p>
                <p className="text-xs mt-1">Add one to get started!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
