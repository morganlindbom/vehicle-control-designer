function ProjectHardwareTab() {
  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Hardware</h3>
      </div>
      <div className="project-overview-grid">
        <div className="project-card__item">
          <div className="project-card__meta">Selected Controller</div>
          <div className="project-card__item-title">RP2350</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">ADC Devices</div>
          <div className="project-card__item-title">MCP3208, ADS1115</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">PWM Outputs</div>
          <div className="project-card__item-title">2 / 12</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">Resource Usage</div>
          <div className="project-card__item-title">ADC 4 / 16</div>
        </div>
      </div>
    </section>
  );
}

export default ProjectHardwareTab;
