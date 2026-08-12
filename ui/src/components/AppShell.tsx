import { NavLink, Outlet } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { PaletteToggle } from './PaletteToggle';
import { SolutionRevealToggle } from './SolutionRevealToggle';

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          DSA Studio <span>AI</span>
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
          <SolutionRevealToggle />
          <PaletteToggle />
          <ThemeToggle />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
