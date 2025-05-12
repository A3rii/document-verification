import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./../../components/ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white border-b" style={{ borderColor: "#f0f0f0" }}>
      <div className="w-container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="text-2xl font-bold"
            style={{ color: "#b8272c" }}>
            LOGO
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-700 hover:text-[#b8272c] transition-colors duration-200">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA Button */}
          <Button
            className="hidden md:block"
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
            Get Started
          </Button>

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
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
