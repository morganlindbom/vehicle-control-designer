import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "../styles/dashboard.css";

const workspaceConfig = {
  project: {
    label: "Project Workspace",
    eyebrow: "Build Vehicles",
    home: "/project/dashboard",
    sidebarItems: [
      { to: "/project/dashboard", label: "Dashboard" },
      { to: "/project/projects", label: "Projects" },
      { to: "/project/validation", label: "Validation" },
      { to: "/project/json", label: "JSON Preview" },
      { to: "/project/code-generator", label: "Code Generator" },
      { to: "/project/firmware-generator", label: "Firmware Generator" },
    ],
  },
  library: {
    label: "Library Workspace",
    eyebrow: "Build Reusable Assets",
    home: "/library/dashboard",
    sidebarItems: [
      { to: "/library/dashboard", label: "Library Dashboard" },
      { to: "/library/templates", label: "Templates" },
      { to: "/library/hardware", label: "Hardware Library" },
      { to: "/library/profiles", label: "Profiles" },
      { to: "/library/settings", label: "Settings" },
    ],
  },
};

function getWorkspaceKey(pathname) {
  return pathname.startsWith("/library") ? "library" : "project";
}

function DashboardLayout() {
  const location = useLocation();
  const workspaceKey = getWorkspaceKey(location.pathname);
  const workspace = workspaceConfig[workspaceKey];

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="dashboard-sidebar__brand" to={workspace.home}>
          Vehicle Control Designer
        </Link>
        <div className="dashboard-sidebar__workspace">{workspace.label}</div>
        <nav className="dashboard-sidebar__nav" aria-label="Main navigation">
          {workspace.sidebarItems.map((item) => (
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
              Engineering Platform · {workspace.eyebrow}
            </span>
            <h1>Vehicle Control Designer</h1>
          </div>
          <nav className="workspace-switcher" aria-label="Workspace switcher">
            <NavLink
              to="/project/dashboard"
              className={
                workspaceKey === "project"
                  ? "workspace-switcher__link workspace-switcher__link--active"
                  : "workspace-switcher__link"
              }
            >
              Project Workspace
            </NavLink>
            <NavLink
              to="/library/dashboard"
              className={
                workspaceKey === "library"
                  ? "workspace-switcher__link workspace-switcher__link--active"
                  : "workspace-switcher__link"
              }
            >
              Library Workspace
            </NavLink>
          </nav>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
