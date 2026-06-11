function ProjectOverviewTab({ project, components, connections }) {
  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Overview</h3>
      </div>
      <div className="project-overview-grid">
        <div className="project-card__item">
          <div className="project-card__meta">Project Name</div>
          <div className="project-card__item-title">{project.name}</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">Component Count</div>
          <div className="project-card__item-title">{components.length}</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">Connection Count</div>
          <div className="project-card__item-title">{connections.length}</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">Hardware Profile</div>
          <div className="project-card__item-title">
            {project.hardwareProfile
              ? project.hardwareProfile
              : "Not Configured"}
          </div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">Last Modified</div>
          <div className="project-card__item-title">Not Available</div>
        </div>
      </div>
    </section>
  );
}

export default ProjectOverviewTab;
