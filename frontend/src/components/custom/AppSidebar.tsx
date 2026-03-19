// src/components/AppSidebar.tsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  CalendarCheck,
  Home, 
  Users,
  HelpCircle, 
  LogOut
} from "lucide-react";
import { toast } from "sonner";

// Menu items
const navItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: CalendarCheck,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Show success message
    toast.success('Signed out successfully');
    
    // Redirect to login
    navigate('/login', { replace: true });
    
    // Force reload to reset app state
    window.location.reload();
  };

  return (
    <Sidebar>
      {/* Header with Resort Name */}
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
            OV
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Ocean View Resort</h2>
            <p className="text-xs text-muted-foreground">Management Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className={isActive ? "text-primary" : ""} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with Sign Out */}
      <SidebarFooter className="border-t p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}