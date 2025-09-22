"use client";

import { useState } from "react";
import type { Task, Category, TaskFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import {
  CategoryDialog,
  TaskDialog,
  CategoryColumn,
} from "@/components/features/board";

// Mock data - in a real app, this would come from your database
const mockCategories: Category[] = [
  { id: 1, name: "To Do" },
  { id: 2, name: "In Progress" },
  { id: 3, name: "Review" },
  { id: 4, name: "Done" },
];

const mockTasks: Task[] = [
  {
    id: 1,
    title: "Design new landing page",
    description:
      "Create a modern, responsive landing page for the new product launch",
    priority: "alta",
    dueDate: "2024-01-15T10:00:00Z",
    completed: false,
    category: mockCategories[0],
    tags: [
      { id: 1, name: "Design" },
      { id: 2, name: "Frontend" },
    ],
  },
  {
    id: 2,
    title: "Implement user authentication",
    description: "Set up secure login and registration system",
    priority: "alta",
    dueDate: "2024-01-20T15:30:00Z",
    completed: false,
    category: mockCategories[1],
    tags: [
      { id: 3, name: "Backend" },
      { id: 4, name: "Security" },
    ],
  },
  {
    id: 3,
    title: "Write API documentation",
    description: "Document all REST endpoints with examples",
    priority: "media",
    completed: false,
    category: mockCategories[2],
    tags: [{ id: 5, name: "Documentation" }],
  },
  {
    id: 4,
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment",
    priority: "baja",
    completed: true,
    category: mockCategories[3],
    tags: [{ id: 6, name: "DevOps" }],
  },
  {
    id: 5,
    title: "Optimize database queries",
    description: "Improve performance of slow queries",
    priority: "media",
    dueDate: "2024-01-25T09:00:00Z",
    completed: false,
    category: mockCategories[0],
    tags: [
      { id: 7, name: "Database" },
      { id: 8, name: "Performance" },
    ],
  },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [categories, setCategories] = useState<Category[]>(mockCategories); // Made categories state mutable
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false); // Added category dialog state
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateCategory = (name: string) => {
    const newCategory: Category = {
      id: Math.max(...categories.map((c) => c.id)) + 1,
      name,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const handleCreateTask = (data: TaskFormData) => {
    const category = categories.find((c) => c.id === data.categoryId);
    if (!category) return;

    const newTask: Task = {
      id: Math.max(...tasks.map((t) => t.id)) + 1,
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate,
      completed: false,
      category,
      tags: [],
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const handleEditTask = (data: TaskFormData) => {
    if (!editingTask) return;

    const category = categories.find((c) => c.id === data.categoryId);
    if (!category) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === editingTask.id
          ? {
              ...task,
              title: data.title,
              description: data.description,
              priority: data.priority,
              dueDate: data.dueDate,
              category,
            }
          : task
      )
    );
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleSubmit = (data: TaskFormData) => {
    if (editingTask) {
      handleEditTask(data);
    } else {
      handleCreateTask(data);
    }
  };

  const getTasksByCategory = (categoryId: number) => {
    return tasks.filter((task) => task.category.id === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground text-balance">
              My Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize and track your work efficiently
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCategoryDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <FolderPlus className="h-4 w-4" />
              <span className="hidden sm:inline">New Category</span>
            </Button>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Task</span>
            </Button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex overflow-x-auto pb-4 gap-6">
          {categories.map((category) => (
            <CategoryColumn
              key={category.id}
              category={category}
              tasks={getTasksByCategory(category.id)}
              onEditTask={openEditDialog}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>

        {/* Task Dialog */}
        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={editingTask}
          categories={categories}
          onSubmit={handleSubmit}
        />

        <CategoryDialog
          open={categoryDialogOpen}
          onOpenChange={setCategoryDialogOpen}
          onSubmit={handleCreateCategory}
        />
      </div>
    </div>
  );
}
