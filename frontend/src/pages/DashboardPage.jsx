import { Link } from "react-router-dom";

function getQuickActionHref(action) {
  if (action === "Create Project") {
    return "/projects";
  }

  if (action === "Open Templates") {
    return "/templates";
  }

  if (action === "Open Hardware Profiles") {
    return "/hardware";
  }

  if (action === "Generate Code") {
    return "/generator/code";
  }

  return "/generator/firmware";
}

function DashboardPage() {
  const recentProjects = ["Scooter V1", "Robot V1", "Electric Bike V1"];
  const systemStatus = [
    ["Backend Status", "Online"],
    ["Template Count", "12"],
    ["Hardware Profile Count", "4"],
    ["Project Count", "3"],
  ];
  const quickActions = [
    "Create Project",
    "Open Templates",
    "Open Hardware Profiles",
    "Generate Code",
    "Generate Firmware",
  ];
  const activityFeed = [
    "Scooter V1 updated architecture view",
    "Robot V1 connection validated",
    "Electric Bike V1 opened from projects",
  ];

  const content = (
    <section className="project-workspace">
      <div className="project-card project-card--full">
        <div className="project-card__header">
          <h2>Dashboard</h2>
        </div>

        <div className="project-overview-grid">
          <article className="project-card">
            <h3>Recent Projects</h3>
            <div className="project-card__list">
              {recentProjects.map((project) => (
                <div key={project} className="project-card__item">
                  <div className="project-card__item-title">{project}</div>
                  <div className="project-card__actions">
                    <Link
                      className="project-button project-button--primary"
                      to="/projects"
                    >
                      Open Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="project-card">
            <h3>System Status</h3>
            <div className="project-list">
              {systemStatus.map(([label, value]) => (
                <div key={label} className="project-card__item">
                  <div className="project-card__item-title">{label}</div>
                  <div className="project-card__meta">{value}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="project-card">
            <h3>Quick Actions</h3>
            <div className="project-card__actions">
              {quickActions.map((action) => (
                <Link
                  key={action}
                  className="project-button project-button--primary"
                  to={getQuickActionHref(action)}
                >
                  {action}
                </Link>
              ))}
            </div>
          </article>

          <article className="project-card">
            <h3>Recent Activity</h3>
            <div className="project-list">
              {activityFeed.map((entry) => (
                <div key={entry} className="project-card__item">
                  <div className="project-card__meta">{entry}</div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );

  return <main className="projects-page project-details-page">{content}</main>;
}

export default DashboardPage;
