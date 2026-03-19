// src/layouts/DashboardLayout.tsx
import { Outlet } from 'react-router-dom'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/custom/AppSidebar'

export default function DashboardLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        {/* Top bar with trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="ml-auto font-medium">Dashboard</div>
          {/* Add avatar, theme switch, notifications, etc. here later */}
        </header>

        {/* Main content area – Outlet renders child routes */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}