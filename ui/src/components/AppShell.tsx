import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { PaletteToggle } from './PaletteToggle';
import { FocusMusicToggle } from './FocusMusicToggle';
import { lastBrowsePath, lastListsPath, lastReferencePath } from '../studio-nav';

export function AppShell() {
  const { pathname } = useLocation();
  const browseTo = lastBrowsePath();
  const listsTo = lastListsPath();
  const referenceTo = lastReferencePath();

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
            <NavLink
              to={browseTo}
              className={() => (pathname === '/browse' ? 'active' : '')}
            >
              Browse
            </NavLink>
            <NavLink
              to={listsTo}
              className={() => (pathname === '/lists' ? 'active' : '')}
            >
              Lists
            </NavLink>
            <NavLink
              to={referenceTo}
              className={() => (pathname.startsWith('/reference') ? 'active' : '')}
            >
              Reference
            </NavLink>
          </nav>
          <FocusMusicToggle />
          <PaletteToggle />
          <ThemeToggle />
        </div>
      </header>
      <Outlet />
    </div>
  );
}
