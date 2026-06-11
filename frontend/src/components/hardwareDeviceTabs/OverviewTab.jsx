function OverviewTab({ device }) {
  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Overview</h3>
      </div>
      <div className="project-details-grid">
        <article className="project-card">
          <div className="project-card__item">
            <div className="project-card__meta">Name</div>
            <div className="project-card__item-title">{device.name}</div>
          </div>
          <div className="project-card__item">
            <div className="project-card__meta">Device Type</div>
            <div className="project-card__item-title">{device.type}</div>
          </div>
          <div className="project-card__item">
            <div className="project-card__meta">Manufacturer</div>
            <div className="project-card__item-title">{device.manufacturer || "-"}</div>
          </div>
          <div className="project-card__item">
            <div className="project-card__meta">Part Number</div>
            <div className="project-card__item-title">{device.partNumber || "-"}</div>
          </div>
          <div className="project-card__item">
            <div className="project-card__meta">Version</div>
            <div className="project-card__item-title">{device.version || "-"}</div>
          </div>
          <div className="project-card__item">
            <div className="project-card__meta">Description</div>
            <div className="project-card__item-title">{device.description || "-"}</div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default OverviewTab;
