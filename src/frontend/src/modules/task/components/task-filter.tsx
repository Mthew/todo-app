"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, ChevronDown, X } from "lucide-react";
import type { TaskFilterFormData } from "../types";
import type { Category } from "@/modules/category";

interface TaskFilterProps {
  filter: TaskFilterFormData;
  onFilterChange: (filter: TaskFilterFormData) => void;
  categories: Category[];
}

export function TaskFilter({
  filter,
  onFilterChange,
  categories,
}: TaskFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (key: keyof TaskFilterFormData, value: any) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      orderBy: "createdAt",
      orderDirection: "desc",
    });
  };

  const hasActiveFilters = Boolean(
    filter.completed !== undefined ||
      filter.priority ||
      filter.categoryId ||
      filter.dueDateFrom ||
      filter.dueDateTo ||
      filter.search
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between mb-4 bg-transparent"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Tasks
            {hasActiveFilters && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-4 p-4 border rounded-lg bg-card">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Filter Options</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1"
            >
              <X className="h-3 w-3" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search tasks..."
              value={filter.search || ""}
              onChange={(e) =>
                handleFilterChange("search", e.target.value || undefined)
              }
            />
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={filter.priority || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "priority",
                  value === "all" ? undefined : value
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="alta">High</SelectItem>
                <SelectItem value="media">Medium</SelectItem>
                <SelectItem value="baja">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filter.categoryId?.toString() || "all"}
              onValueChange={(value) =>
                handleFilterChange(
                  "categoryId",
                  value === "all" ? undefined : Number.parseInt(value)
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date From */}
          <div className="space-y-2">
            <Label htmlFor="dueDateFrom">Due Date From</Label>
            <Input
              id="dueDateFrom"
              type="date"
              value={
                filter.dueDateFrom
                  ? filter.dueDateFrom.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  "dueDateFrom",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </div>

          {/* Due Date To */}
          <div className="space-y-2">
            <Label htmlFor="dueDateTo">Due Date To</Label>
            <Input
              id="dueDateTo"
              type="date"
              value={
                filter.dueDateTo
                  ? filter.dueDateTo.toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleFilterChange(
                  "dueDateTo",
                  e.target.value ? new Date(e.target.value) : undefined
                )
              }
            />
          </div>

          {/* Order By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filter.orderBy}
              onValueChange={(value) => handleFilterChange("orderBy", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Completed Status and Order Direction */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={filter.completed === true}
              onCheckedChange={(checked) =>
                handleFilterChange(
                  "completed",
                  checked === true ? true : undefined
                )
              }
            />
            <Label htmlFor="completed" className="text-sm">
              Show only completed tasks
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-sm">Order:</Label>
            <Select
              value={filter.orderDirection}
              onValueChange={(value) =>
                handleFilterChange("orderDirection", value)
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Desc</SelectItem>
                <SelectItem value="asc">Asc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
