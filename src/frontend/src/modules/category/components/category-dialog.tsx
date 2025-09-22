"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategory } from "../hooks/useCategory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Category } from "../types";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void; // Optional callback for when category is successfully created/updated
  category?: Category | null; // Category to edit (null for create mode)
}

export function CategoryDialog({
  open,
  onOpenChange,
  onSuccess,
  category,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [submitError, setSubmitError] = useState<string>("");
  const { createCategory, updateCategory, state } = useCategory();

  const isEditMode = !!category;

  // Set initial values when category prop changes
  useEffect(() => {
    if (category) {
      setName(category.name);
    } else {
      setName("");
    }
    setSubmitError("");
  }, [category, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setSubmitError("Category name is required");
      return;
    }

    try {
      setSubmitError("");

      if (isEditMode && category) {
        await updateCategory(category.id, { name: name.trim() });
      } else {
        await createCategory({ name: name.trim() });
      }

      // Success - close dialog and reset state
      setName("");
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} category:`,
        error
      );
      setSubmitError(
        error?.message ||
          `Failed to ${
            isEditMode ? "update" : "create"
          } category. Please try again.`
      );
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setName("");
      setSubmitError("");
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Category" : "Create New Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the category name to better organize your tasks."
              : "Add a new category to organize your tasks better."}
          </DialogDescription>
        </DialogHeader>

        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Enter category name"
                autoFocus
                disabled={state.isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={state.isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim() || state.isLoading}>
              {state.isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Category"
                : "Create Category"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
