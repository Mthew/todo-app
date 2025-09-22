import { ReactNode } from "react";
import { MainNavbar } from "@/components/common/main-navbar";

interface BoardLayoutProps {
  children: ReactNode;
}

export default function BoardLayout({ children }: BoardLayoutProps) {
  return (
    <div className="min-h-screen">
      <MainNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
