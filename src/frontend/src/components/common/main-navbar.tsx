"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/common/theme-toggle";

// Mock user data - in a real app, this would come from your auth system
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: null, // No avatar URL provided
};

export function MainNavbar() {
  const [user] = useState(mockUser);

  const handleLogout = () => {
    // In a real app, this would handle the logout logic
    console.log("Logging out...");
    // Redirect to login page or clear auth state
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                K
              </span>
            </div>
            <span className="font-semibold text-lg text-foreground">
              Kanban
            </span>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-auto p-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.avatar || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
