import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  Activity,
  LogOut,
  Hexagon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealth } from "@/hooks/use-system";
import { useCurrentUser } from "@/hooks/use-users";
// Placeholder for future ThemeToggle and UserNav components
const ThemeToggle = () => null;
const UserNav = () => null;

const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href} className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group",
      isActive 
        ? "bg-primary/10 text-primary" 
        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
    )}>
      <Icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      {label}
    </Link>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data: health } = useHealth();
  const { data: user } = useCurrentUser();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 flex flex-col fixed inset-y-0 z-50 bg-background/95 backdrop-blur-sm">
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-2 text-primary font-bold text-lg tracking-tight">
            <Hexagon className="w-6 h-6 fill-primary/20" />
            <span>GSM<span className="text-foreground">Flow</span></span>
          </div>
          <div className="ml-auto text-[10px] font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            v1.0
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform</div>
          <NavItem href="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/tenants" icon={Building2} label="Tenants" />
          <NavItem href="/users" icon={Users} label="Users" />
          
          <div className="px-3 mt-8 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Configuration</div>
          <NavItem href="/settings" icon={Settings} label="System Settings" />
        </nav>

        {/* Footer Status */}
        <div className="p-4 border-t border-border/40 bg-muted/20">
          {user && (
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {user.email.substring(0, 2).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name || 'Admin User'}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground font-mono">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", 
              health?.status === 'ok' ? "bg-emerald-500" : "bg-rose-500"
            )} />
            <span>{health?.runtime || 'Checking...'}</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-w-0 flex flex-col">
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-8 bg-background/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Foundation Phase</span>
            <span className="w-px h-4 bg-border" />
            <span>Multi-tenant GSM Services</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono bg-secondary/50 px-3 py-1.5 rounded-full border border-white/5">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span>System Operational</span>
            </div>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
