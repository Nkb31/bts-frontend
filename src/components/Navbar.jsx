import { Link, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import api from "../services/api";

function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isDashboard) return null;

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="bg-canvas border-b border-hairline sticky top-0 z-50 backdrop-blur-sm">
      <div className="container-responsive flex items-center justify-between h-14 sm:h-16">
        <h2 className="font-geist font-medium text-lg sm:text-xl tracking-tight text-ink">
          Bank Transaction System
        </h2>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-geist text-body-sm text-body hover:text-ink px-3 py-2 rounded-sm hover:bg-hairline-soft transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/"
            className="btn-ghost-sm"
            onClick={async () => {
              const token = localStorage.getItem("token");
              try { await api.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } }); } catch { /* local logout still completes */ }
              localStorage.removeItem("token");
            }}
          >
            <FaSignOutAlt className="inline-block mr-1" />
            Logout
          </Link>
        </div>

        {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
          className="md:hidden p-2 text-ink hover:bg-hairline-soft rounded-sm transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
          </button>
          </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-hairline bg-canvas">
          <div className="container-responsive py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="block font-geist text-body-sm text-body hover:text-ink px-3 py-2 rounded-sm hover:bg-hairline-soft transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/"
              className="flex items-center font-geist text-body-sm text-ink px-3 py-2 rounded-sm hover:bg-hairline-soft transition-colors"
              onClick={() => {
                const token = localStorage.getItem("token");
                api.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
                localStorage.removeItem("token");
                setIsMobileMenuOpen(false);
              }}
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
