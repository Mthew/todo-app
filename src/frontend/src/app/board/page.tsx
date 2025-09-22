"use client";

import { useMemo, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, FolderPlus } from "lucide-react";
import {
  CategoryDialog,
  DeleteCategoryDialog,
  useCategory,
  Category,
  CategoryColumn,
} from "@/modules/category";
import {
  TaskDialog,
  useTask,
  Task,
  TaskFormData,
  TaskFilter,
  TaskFilterFormData,
} from "@/modules/task";

export default function BoardPage() {
  const { state: categoryState, deleteCategory } = useCategory();

  const {
    state: taskState,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  } = useTask();

  // Filter state
  const [filter, setFilter] = useState<TaskFilterFormData>({
    orderBy: "createdAt",
    orderDirection: "desc",
  });

  // Apply filters to tasks (hybrid approach)
  const filteredTasks = useMemo(() => {
    // If data is already server-filtered, return as-is
    if (taskState.isServerFiltered) {
      return taskState.tasks;
    }

    // Otherwise, apply client-side filtering for immediate feedback
    let filtered = [...taskState.tasks];

    // Search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Priority filter
    if (filter.priority) {
      filtered = filtered.filter((task) => task.priority === filter.priority);
    }

    // Category filter (for global filtering, we'll handle this separately in category columns)
    if (filter.categoryId) {
      filtered = filtered.filter(
        (task) => task.categoryId === filter.categoryId
      );
    }

    // Completed status filter
    if (filter.completed !== undefined) {
      filtered = filtered.filter((task) => task.completed === filter.completed);
    }

    // Due date range filter
    if (filter.dueDateFrom) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate >= filter.dueDateFrom!;
      });
    }

    if (filter.dueDateTo) {
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        const taskDate = new Date(task.dueDate);
        return taskDate <= filter.dueDateTo!;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (filter.orderBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "priority":
          const priorityOrder = { baja: 1, media: 2, alta: 3 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case "dueDate":
          aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
          bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
          break;
        case "createdAt":
        default:
          // Assuming newer tasks have higher IDs (common pattern)
          aValue = a.id;
          bValue = b.id;
          break;
      }

      if (aValue < bValue) return filter.orderDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return filter.orderDirection === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [taskState.tasks, taskState.isServerFiltered, filter]);

  // Effect to fetch tasks with server-side filtering
  useEffect(() => {
    // Debounce filter changes to avoid too many API calls
    const timeoutId = setTimeout(() => {
      // Check if we have any filters that warrant server-side filtering
      const hasFilters = Boolean(
        filter.search ||
          filter.priority ||
          filter.categoryId ||
          filter.completed !== undefined ||
          filter.dueDateFrom ||
          filter.dueDateTo
      );

      // Always fetch with filters for server-side filtering
      fetchTasks(filter);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [filter, fetchTasks]);

  // Dialog states
  const [isNewCategoryOpen, setIsNewCategoryOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  // Task handlers
  const handleCreateTask = async (data: TaskFormData) => {
    await createTask(data);
    setIsNewTaskOpen(false);
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
      setEditingTask(null);
    }
  };

  // Helper functions
  const openEditDialog = (task: any) => {
    // Convert old task format to new task format for editing
    const newTask = taskState.tasks.find((t) => t.id === task.id);
    if (newTask) {
      setEditingTask(newTask);
    }
  };

  const convertTasksForDisplay = (tasks: Task[], categoryId: number) => {
    const category = categoryState.categories.find((c) => c.id === categoryId);
    if (!category) return [];

    return tasks.map((task) => ({
      ...task,
      category: category,
      userId: task.userId || 1, // Provide default userId for compatibility
      tags: task.tags || [],
    }));
  };

  const getTasksByCategory = (categoryId: number) => {
    const categoryTasks = filteredTasks.filter(
      (task: Task) => task.categoryId === categoryId
    );
    return convertTasksForDisplay(categoryTasks, categoryId);
  };

  const convertTaskForEdit = (task: Task | null) => {
    if (!task) return null;
    const category = categoryState.categories.find(
      (c) => c.id === task.categoryId
    );
    if (!category) return null;

    return {
      ...task,
      category: category,
      tags: task.tags || [],
    };
  };

  const isLoading = categoryState.isLoading || taskState.isLoading;
  const error = categoryState.error || taskState.error;

  if (isLoading && categoryState.categories.length === 0) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 h-96"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsNewCategoryOpen(true)}
            variant="outline"
            size="sm"
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Category
          </Button>
          <Button onClick={() => setIsNewTaskOpen(true)} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      <TaskFilter
        filter={filter}
        onFilterChange={setFilter}
        categories={categoryState.categories}
        isLoading={taskState.isLoading}
      />
      {error && (
        <Alert className="mb-6" variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-x-30 ">
        {categoryState.categories.map((category: Category) => (
          <CategoryColumn
            key={category.id}
            category={category}
            tasks={getTasksByCategory(category.id)}
            onEditTask={openEditDialog}
            onDeleteTask={deleteTask}
            onEditCategory={setEditingCategory}
            onDeleteCategory={(categoryId: number) => {
              const categoryToDelete = categoryState.categories.find(
                (c) => c.id === categoryId
              );
              if (categoryToDelete) setCategoryToDelete(categoryToDelete);
            }}
          />
        ))}
      </div>

      {/* Create Category Dialog */}
      <CategoryDialog
        open={isNewCategoryOpen}
        onOpenChange={setIsNewCategoryOpen}
        onSuccess={() => setIsNewCategoryOpen(false)}
      />

      {/* Edit Category Dialog */}
      <CategoryDialog
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        onSuccess={() => setEditingCategory(null)}
        category={editingCategory}
      />

      {/* Delete Category Dialog */}
      <DeleteCategoryDialog
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        onConfirm={handleDeleteCategory}
        category={categoryToDelete}
      />

      {/* Create Task Dialog */}
      <TaskDialog
        open={isNewTaskOpen}
        onOpenChange={setIsNewTaskOpen}
        onSubmit={handleCreateTask}
        categories={categoryState.categories}
      />

      {/* Edit Task Dialog */}
      <TaskDialog
        open={!!editingTask}
        onOpenChange={(open) => !open && setEditingTask(null)}
        onSubmit={handleUpdateTask}
        task={convertTaskForEdit(editingTask)}
        categories={categoryState.categories}
      />
    </div>
  );
}
