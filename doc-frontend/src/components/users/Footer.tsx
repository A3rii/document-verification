export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: "", href: "#", label: "Facebook" },
    { icon: "", href: "#", label: "Twitter" },
    { icon: "", href: "#", label: "LinkedIn" },
    { icon: "", href: "#", label: "Instagram" },
  ];

  return (
    <footer className="bg-white border-t mt-auto">
      <div className="w-container mx-auto px-4">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo and Copyright */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h3 className="text-2xl font-bold" style={{ color: "#b8272c" }}>
                LOGO
              </h3>
              <p className="text-sm text-gray-600">
                © {currentYear} Your Company. All rights reserved.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-400 hover:text-[#b8272c] transition-colors duration-200"></a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
