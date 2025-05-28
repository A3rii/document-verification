import { Settings, LogOut, ChevronDown, BookOpenCheck } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
} from "./../ui/sidebar";
import { cn } from "../../lib/utils";
import { Link } from "react-router";
import RUPP from "./../../assets/logo/rupp_logo.png";
import CollapseMenu from "./../admin/Sidebar/CollapseMenu";
import { logout } from "./../../app/auth/authSlice";
import useCurrentUser from "../../hooks/use-current-user";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./../../components/ui/avatar";

// Collapsible menu items
const collapsibleItems = [
  {
    title: "Certificate",
    url: "/user/certificate",
    icon: BookOpenCheck,
    isActive: false,
    isCollapsable: false,
    items: [],
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export default function UserSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  //* Log out from the account
  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <Sidebar className="bg-[#f6f6f7]">
      {/* Logo Section */}
      <SidebarHeader className="border-b">
        <div className="flex flex-col justify-center items-center px-6">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={RUPP}
                alt="RUPP Logo"
                className="h-36 w-36 object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-md lg:text-nowrap font-bold text-custom-primary bg-clip-text ">
              RUPP
            </h1>
            <p className="text-sm text-muted-foreground">
              Document Verification
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin scrollbar-thumb-muted">
        {/* Main Navigation */}
        <SidebarGroup className="px-3 py-4">
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <CollapseMenu items={collapsibleItems} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings Section */}
        <SidebarGroup className="border-t px-3 py-4">
          <SidebarGroupLabel className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="gap-3 px-3 py-2.5">
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5 text-custom-primary" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Section */}
      <SidebarFooter className="border-t p-3">
        <button
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          className="flex w-full items-center gap-3 rounded-lg p-3 transition-colors  hover:bg-gray-200">
          <Avatar>
            <AvatarImage src={""} alt="@shadcn" />
            <AvatarFallback>
              {user?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-sm font-semibold">
              {user?.name.toUpperCase()}
            </span>
            <span className="text-xs text-muted-foreground">{user?.email}</span>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isProfileOpen && "rotate-180"
            )}
          />
        </button>

        {isProfileOpen && (
          <Button
            onClick={handleLogOut}
            className=" bg-custom-primary text-white font-sora font-semibold rounded-lg hover:bg-custom-primary-dark transition duration-300 cursor-pointer">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
