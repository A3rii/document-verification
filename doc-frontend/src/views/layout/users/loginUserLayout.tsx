import {
  SidebarProvider,
  SidebarTrigger,
} from "./../../../components/ui/sidebar";
import UserSidebar from "../../../components/users/UserSidenbar";
import { Outlet } from "react-router";
import { Toaster } from "./../../../components/ui/sonner";
export default function LoginUserLayout () {
  return (
    <SidebarProvider>
      <UserSidebar />
      <main className="flex-1 w-[calc(100%-var(--sidebar-width))] ">
        <SidebarTrigger />
        <div className="grow h-auto min-h-fit py-8 max-w-full px-12 ">
          <Outlet />
        </div>
      </main>
      <Toaster
        richColors={true}
        theme="light"
        position="top-right"
        expand={true}
        visibleToasts={1}
        closeButton={true}
        toastOptions={{
          duration: 3000,
        }}
      />
    </SidebarProvider>
  );
}
