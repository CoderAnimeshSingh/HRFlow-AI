import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, Users, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const DashboardHeader = ({ user, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold">
              <span className="text-gradient">HRFlow</span>
              <span className="text-foreground"> AI</span>
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link 
              to="/apply" 
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              <Users className="h-4 w-4" />
              Application Form
            </Link>
          </nav>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-foreground">
                {user?.user_metadata?.full_name || 'Admin'}
              </p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
