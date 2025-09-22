"use client";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { AuthHeader } from "@/modules/auth/components/AuthHeader";

export function MainNavbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                F
              </span>
            </div>
            <span className="font-semibold text-lg text-foreground">
              Fracttal TO DO App
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AuthHeader />
          </div>
        </div>
      </div>
    </nav>
  );
}
