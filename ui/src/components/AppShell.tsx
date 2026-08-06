import { NavLink, Outlet } from 'react-router-dom';

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          DSA <span>Studio</span>
        </NavLink>
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
      </header>
      <Outlet />
    </div>
  );
}
