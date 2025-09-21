import { MainLayout, Header } from "@/components/layout";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context";

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <Header />
      <main className="container mx-auto py-6">
        <PageHeader
          title="Welcome to Todo App"
          description="Manage your tasks efficiently and stay organized"
        />
        <div className="mt-8 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              A simple and powerful task management application to help you stay productive.
            </p>
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You're logged in! Ready to manage your tasks?
                </p>
                <Button asChild>
                  <Link to="/tasks">Go to My Tasks</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Get started by logging in to access your personal task dashboard.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
