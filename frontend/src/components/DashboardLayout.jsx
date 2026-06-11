import { NavLink, Outlet } from "react-router-dom";
import "../styles/dashboard.css";

const sidebarItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/templates", label: "Templates" },
  { to: "/hardware", label: "Hardware" },
  { to: "/json", label: "JSON Preview" },
  { to: "/generator/code", label: "Code Generator" },
  { to: "/generator/firmware", label: "Firmware Generator" },
  { to: "/settings", label: "Settings" },
];

function DashboardLayout() {
  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-sidebar__brand">Vehicle Control Designer</div>
        <nav className="dashboard-sidebar__nav" aria-label="Main navigation">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "dashboard-sidebar__link dashboard-sidebar__link--active"
                  : "dashboard-sidebar__link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <span className="dashboard-topbar__eyebrow">
              Engineering Platform
            </span>
            <h1>Vehicle Control Designer</h1>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
