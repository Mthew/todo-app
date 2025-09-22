"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { Task, Category, TaskFormData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
  categories: Category[];
  onSubmit: (data: TaskFormData) => void;
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  categories,
  onSubmit,
}: TaskDialogProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "media",
    dueDate: "",
    categoryId: categories[0]?.id || 1,
  });
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || "",
        priority: task.priority,
        dueDate: task.dueDate || "",
        categoryId: task.category.id,
      });
      if (task.dueDate) {
        setSelectedDate(new Date(task.dueDate));
      }
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "media",
        dueDate: "",
        categoryId: categories[0]?.id || 1,
      });
      setSelectedDate(undefined);
    }
  }, [task, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: selectedDate ? selectedDate.toISOString() : undefined,
    });
    onOpenChange(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      dueDate: date ? date.toISOString() : "",
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter task title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Enter task description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: Number.parseInt(value),
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: "baja" | "media" | "alta") =>
                  setFormData((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="baja">Low</SelectItem>
                  <SelectItem value="media">Medium</SelectItem>
                  <SelectItem value="alta">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {task ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
