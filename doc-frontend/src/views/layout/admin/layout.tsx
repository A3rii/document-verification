import {
  SidebarProvider,
  SidebarTrigger,
} from "./../../../components/ui/sidebar";
import AppSidebar from "./../../../components/admin/AppSidebar";
import { Outlet } from "react-router";
export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 w-[calc(100%-var(--sidebar-width))]">
        <SidebarTrigger />
        <div className="grow h-auto min-h-fit py-8 max-w-full px-12">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
