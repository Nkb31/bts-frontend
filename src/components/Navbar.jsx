import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaBuilding, FaChartLine, FaSignOutAlt, FaTimes, FaWallet } from "react-icons/fa";
import ThemeToggle from "./ThemeToggle";
import api from "../services/api";

function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navLinks = [
    { href: "#overview", label: "Overview", icon: FaChartLine },
    { href: "#accounts", label: "Accounts", icon: FaWallet },
    { href: "#activity", label: "Activity", icon: FaChartLine },
  ];

  if (location.pathname !== "/dashboard") return null;

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await api.post("/api/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch {
      // Clear local auth even if the API is unavailable.
    } finally {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/90 backdrop-blur-md">
      <div className="container-responsive flex h-16 items-center justify-between gap-4">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-3" onClick={closeMenu}>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-on-primary shadow-sm" aria-hidden="true"><FaBuilding className="text-sm" /></span>
          <span className="min-w-0"><span className="block truncate font-geist text-sm font-medium tracking-tight text-ink sm:text-base">Bank Transaction System</span><span className="hidden font-geist-mono text-[10px] uppercase tracking-[0.18em] text-mute sm:block">Personal banking</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navLinks.map(({ href, label }) => <a key={href} href={href} className="rounded-md px-3 py-2 font-geist text-body-sm text-body transition-colors hover:bg-hairline-soft hover:text-ink">{label}</a>)}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <div className="mr-2 hidden items-center gap-2 text-body-sm text-mute lg:flex"><span className="h-2 w-2 rounded-full bg-cyan" aria-hidden="true" />Secure session</div>
          <ThemeToggle />
          <button type="button" onClick={logout} className="btn-ghost-sm inline-flex items-center gap-2"><FaSignOutAlt aria-hidden="true" />Logout</button>
        </div>

        <div className="flex items-center gap-2 md:hidden"><ThemeToggle /><button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-hairline-soft" onClick={() => setIsMobileMenuOpen((open) => !open)} aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isMobileMenuOpen}>{isMobileMenuOpen ? <FaTimes /> : <FaBars />}</button></div>
      </div>

      {isMobileMenuOpen && <div className="border-t border-hairline bg-canvas md:hidden"><nav className="container-responsive space-y-1 py-3" aria-label="Mobile navigation">
        {navLinks.map(({ href, label, icon: Icon }) => <a key={href} href={href} onClick={closeMenu} className="flex items-center gap-3 rounded-md px-3 py-3 font-geist text-body-sm text-body hover:bg-hairline-soft hover:text-ink"><Icon className="text-mute" aria-hidden="true" />{label}</a>)}
        <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left font-geist text-body-sm text-ink hover:bg-hairline-soft"><FaSignOutAlt aria-hidden="true" />Logout</button>
      </nav></div>}
    </header>
  );
}

export default Navbar;
