export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-auto w-full min-h-[25rem]">
      <div className="w-container mx-auto px-4">
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo and Copyright */}
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-2xl font-bold text-custom-primary text-center">
                Royal University of Phnom Penh
              </h3>
              <p className="text-sm text-gray-600">
                © {currentYear} All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
  