import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  children?: React.ReactNode;
}

export function Header({ children }: HeaderProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-lg font-semibold hover:text-primary">
            Todo App
          </Link>
          {children}
        </div>
        
        <nav className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className="text-sm font-medium hover:text-primary">
                My Tasks
              </Link>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary">
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
