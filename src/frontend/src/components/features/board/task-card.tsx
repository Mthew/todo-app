"use client";

import type { Task } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreHorizontal, FilePen, Trash2 } from "lucide-react";
import { format, isAfter } from "date-fns";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && isAfter(new Date(), new Date(task.dueDate));

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "alta":
        return "bg-red-900/50 text-red-300 border-red-800";
      case "media":
        return "bg-yellow-900/50 text-yellow-300 border-yellow-800";
      case "baja":
        return "bg-green-900/50 text-green-300 border-green-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "alta":
        return "High";
      case "media":
        return "Medium";
      case "baja":
        return "Low";
      default:
        return priority;
    }
  };

  return (
    <Card className="bg-card hover:bg-accent/50 transition-colors cursor-pointer">
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-semibold text-card-foreground text-balance leading-tight">
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">
              {task.description}
            </p>
          )}
        </div>

        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center gap-2">
            {task.dueDate && (
              <div
                className={`flex items-center gap-1 text-xs ${
                  isOverdue ? "text-red-400" : "text-muted-foreground"
                }`}
              >
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(task.dueDate), "MMM d")}</span>
              </div>
            )}
            <Badge
              variant="outline"
              className={`text-xs ${getPriorityColor(task.priority)}`}
            >
              {getPriorityLabel(task.priority)}
            </Badge>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(task)}>
                <FilePen className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(task.id)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
