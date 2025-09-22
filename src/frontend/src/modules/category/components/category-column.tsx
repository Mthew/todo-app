"use client";

import type { Task } from "@/lib/types";
import { Category } from "../types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { TaskCard } from "../../../components/features/board/task-card";

interface CategoryColumnProps {
  category: Category;
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: number) => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (categoryId: number) => void;
}

export function CategoryColumn({
  category,
  tasks,
  onEditTask,
  onDeleteTask,
  onEditCategory,
  onDeleteCategory,
}: CategoryColumnProps) {
  return (
    <div className="flex-shrink-0 w-80">
      <Card className="bg-card h-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-card-foreground">
              {category.name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {tasks.length}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open category menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEditCategory?.(category)}>
                    <FilePen className="mr-2 h-4 w-4" />
                    Edit Category
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDeleteCategory?.(category.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Category
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
