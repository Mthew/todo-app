import { MainLayout, Header } from "@/components/layout";
import { PageHeader } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";

export function TasksPage() {
  const { user } = useAuth();

  return (
    <MainLayout>
      <Header />
      <main className="container mx-auto py-6">
        <PageHeader 
          title={`Welcome back, ${user?.name || 'User'}!`}
          description="Manage your todo items and stay organized" 
        />
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Tasks</h2>
            <Button>Add New Task</Button>
          </div>
          
          <div className="grid gap-4">
            {/* TODO: Add task list and management components here */}
            <div className="border rounded-lg p-6 text-center">
              <p className="text-muted-foreground mb-4">
                No tasks yet. Create your first task to get started!
              </p>
              <Button variant="outline">Create Your First Task</Button>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
