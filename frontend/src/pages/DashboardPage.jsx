import { Link } from "react-router-dom";

function getQuickActionHref(action) {
  if (action === "Create Project") {
    return "/project/projects";
  }

  if (action === "Open Project Dashboard") {
    return "/project/dashboard";
  }

  if (action === "Open Validation") {
    return "/project/validation";
  }

  if (action === "Open JSON Preview") {
    return "/project/json";
  }

  return "/project/code-generator";
}

function DashboardPage() {
  const recentProjects = ["Scooter V1", "Robot V1", "Electric Bike V1"];
  const recentBuilds = [
    "Scooter V1 firmware generated",
    "Robot V1 architecture validated",
    "Electric Bike V1 JSON exported",
  ];
  const validationSummary = [
    ["Errors", "1"],
    ["Warnings", "1"],
    ["Info", "2"],
  ];
  const systemStatus = [
    ["Backend Status", "Online"],
    ["Template Count", "12"],
    ["Hardware Profile Count", "4"],
    ["Project Count", "3"],
  ];
  const quickActions = [
    "Create Project",
    "Open Project Dashboard",
    "Open Validation",
    "Open JSON Preview",
    "Generate Code",
  ];

  const content = (
    <section className="project-workspace">
      <div className="project-card project-card--full">
        <div className="project-card__header">
          <h2>Project Dashboard</h2>
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
                      to="/project/projects"
                    >
                      Open Project
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="project-card">
            <h3>Recent Builds</h3>
            <div className="project-list">
              {recentBuilds.map((build) => (
                <div key={build} className="project-card__item">
                  <div className="project-card__item-title">{build}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="project-card">
            <h3>Validation Summary</h3>
            <div className="project-overview-grid">
              {validationSummary.map(([label, value]) => (
                <div key={label} className="project-card__item">
                  <div className="project-card__meta">{label}</div>
                  <div className="project-card__item-title">{value}</div>
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
        </div>
      </div>
    </section>
  );

  return <main className="projects-page project-details-page">{content}</main>;
}

export default DashboardPage;
