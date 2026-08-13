import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { PaletteToggle } from './PaletteToggle';

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          <span className="brand-mark-frame" aria-hidden="true">
            <img className="brand-mark" src="/logo.png" alt="" width={28} height={28} />
          </span>
          DSA Studio <span className="brand-gradient-text">AI</span>
        </NavLink>
        <div className="topbar-right">
          <nav className="nav">
            <NavLink to="/browse" className={({ isActive }) => (isActive ? 'active' : '')}>
              Browse
            </NavLink>
            <NavLink to="/lists" className={({ isActive }) => (isActive ? 'active' : '')}>
              Lists
            </NavLink>
            <NavLink to="/reference" className={({ isActive }) => (isActive ? 'active' : '')}>
              Reference
            </NavLink>
          </nav>
          <PaletteToggle />
          <ThemeToggle />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
