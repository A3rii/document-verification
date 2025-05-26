import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import RUPP_LOGO from "./../assets/logo/rupp_logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "./../components/ui/avatar";
import { Link, useNavigate } from "react-router";
import useCurrentUser from "../hooks/use-current-user";
export default function Header() {
  const user = useCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Verify", href: "/verify" },
    { label: "Document", href: "/student-document" },
  ];

  return (
    <header className="bg-white border-b" style={{ borderColor: "#f0f0f0" }}>
      <div className="w-container mx-auto">
        <div className="flex items-center justify-between h-24">
          {/* Logo */}
          <Link to="/" className="flex jusify-center items-center gap-4">
            <img src={RUPP_LOGO} className="size-16 font-bold" />
            <p className="font-sora font-[800] text-[26px] text-custom-primary">
              Certificate Verification
            </p>
          </Link>

          <div className="flex justify-center items-center gap-12">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-700 hover:text-[#b8272c] transition-colors duration-200 font-sora font-[600]">
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop CTA Button */}
            {user ? (
              <>
                <Avatar>
                  <AvatarImage alt="@shadcn" />
                  <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="hidden md:block font-sora pointer-cursor"
                style={{
                  backgroundColor: "#b8272c",
                  borderColor: "#b8272c",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#9a2024";
                  e.currentTarget.style.borderColor = "#9a2024";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#b8272c";
                  e.currentTarget.style.borderColor = "#b8272c";
                }}>
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-3 space-y-1 bg-white border-t">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-2 text-gray-700 hover:text-[#b8272c] hover:bg-gray-50 rounded-md transition-colors duration-200">
                {item.label}
              </a>
            ))}

            {!user && (
              <Button
                className="w-full mt-4"
                style={{
                  backgroundColor: "#b8272c",
                  borderColor: "#b8272c",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#9a2024";
                  e.currentTarget.style.borderColor = "#9a2024";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#b8272c";
                  e.currentTarget.style.borderColor = "#b8272c";
                }}>
                Login
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
