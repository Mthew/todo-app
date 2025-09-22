"use client";

import { useState } from "react";
import type { Task, TaskFormData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from "lucide-react";
import { TaskDialog, CategoryColumn } from "@/components/features/board";
import {
  CategoryDialog,
  DeleteCategoryDialog,
  useCategory,
  Category,
} from "@/modules/category";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock tasks data - TODO: Replace with real API calls
const mockTasks: Task[] = [
  {
    id: 1,
    title: "Design new landing page",
    description:
      "Create a modern, responsive landing page for the new product launch",
    priority: "alta",
    dueDate: "2024-01-15T10:00:00Z",
    completed: false,
    category: { id: 1, name: "To Do" },
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
    category: { id: 2, name: "In Progress" },
    tags: [
      { id: 3, name: "Backend" },
      { id: 4, name: "Security" },
    ],
  },
];

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] =
    useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  // Use the category context
  const {
    state: categoryState,
    fetchCategories,
    deleteCategory,
  } = useCategory();
  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = categoryState;

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

  const handleCategorySuccess = () => {
    fetchCategories();
  };

  // Category handlers
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setCategoryToDelete(category);
      setDeleteCategoryDialogOpen(true);
    }
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete.id);

      // Remove tasks from the deleted category
      setTasks((prev) =>
        prev.filter((task) => task.category.id !== categoryToDelete.id)
      );

      // Close dialog and reset state
      setDeleteCategoryDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Failed to delete category:", error);
      // Error handling is already done in the context
    }
  };

  const handleCategoryDialogClose = (open: boolean) => {
    setCategoryDialogOpen(open);
    if (!open) {
      setEditingCategory(null);
    }
  };

  // Show loading state
  if (categoriesLoading && categories.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Tasks</h1>
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

        {categoriesError && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              Error loading categories: {categoriesError}
              <Button
                variant="outline"
                size="sm"
                onClick={fetchCategories}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex overflow-x-auto pb-4 gap-6">
          {categories.length === 0 ? (
            <div className="w-full text-center py-20">
              <p className="text-muted-foreground mb-4">
                No categories found. Create your first category to get started!
              </p>
              <Button
                onClick={() => setCategoryDialogOpen(true)}
                className="gap-2"
              >
                <FolderPlus className="h-4 w-4" />
                Create Category
              </Button>
            </div>
          ) : (
            categories.map((category) => (
              <CategoryColumn
                key={category.id}
                category={category}
                tasks={getTasksByCategory(category.id)}
                onEditTask={openEditDialog}
                onDeleteTask={handleDeleteTask}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
              />
            ))
          )}
        </div>

        <TaskDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          task={editingTask}
          categories={categories}
          onSubmit={handleSubmit}
        />

        <CategoryDialog
          open={categoryDialogOpen}
          onOpenChange={handleCategoryDialogClose}
          onSuccess={handleCategorySuccess}
          category={editingCategory}
        />

        <DeleteCategoryDialog
          open={deleteCategoryDialogOpen}
          onOpenChange={setDeleteCategoryDialogOpen}
          category={categoryToDelete}
          onConfirm={confirmDeleteCategory}
          isLoading={categoryState.isLoading}
        />
      </div>
    </div>
  );
}
