function LibraryDashboardPage() {
  const metrics = [
    ["Template Count", "12"],
    ["Hardware Device Count", "28"],
    ["Profile Count", "4"],
  ];

  const recentChanges = [
    "MCP3208 hardware device updated",
    "Scooter profile placeholder created",
    "Input template category refined",
  ];

  const quickActions = [
    "Review Templates",
    "Open Hardware Library",
    "Manage Profiles",
    "Update Settings",
  ];

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Library Dashboard</h2>
          </div>
          <p>
            Manage reusable assets that support every project in the platform.
          </p>
        </div>

        <div className="project-overview-grid">
          {metrics.map(([label, value]) => (
            <article key={label} className="project-card">
              <div className="project-card__meta">{label}</div>
              <div className="project-card__item-title">{value}</div>
            </article>
          ))}
        </div>

        <div className="project-details-grid">
          <article className="project-card">
            <h3>Recent Library Changes</h3>
            <div className="project-list">
              {recentChanges.map((entry) => (
                <div key={entry} className="project-card__item">
                  <div className="project-card__meta">Update</div>
                  <div className="project-card__item-title">{entry}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="project-card">
            <h3>Quick Actions</h3>
            <div className="project-list">
              {quickActions.map((action) => (
                <div key={action} className="project-card__item">
                  <div className="project-card__item-title">{action}</div>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

export default LibraryDashboardPage;
