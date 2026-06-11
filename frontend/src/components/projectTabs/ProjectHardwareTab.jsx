function ProjectHardwareTab() {
  const specs = [
    ["Selected Controller", "RP2350"],
    ["Selected ADC Devices", "MCP3208 x2"],
    ["Selected PWM Drivers", "IR4427"],
    ["ADC Usage", "4 / 16"],
    ["PWM Usage", "3 / 12"],
    ["Status", "Valid"],
  ];

  const validationItems = [
    "Controller supports selected component timing.",
    "ADC capacity available for analog inputs.",
    "PWM driver capacity available for outputs.",
    "No hardware resource conflicts detected.",
  ];

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Hardware</h3>
      </div>
      <p>
        Configure hardware for this project. Global hardware definitions are
        managed in the Library Workspace.
      </p>

      <div className="project-overview-grid">
        {specs.map(([label, value]) => (
          <div key={label} className="project-card__item">
            <div className="project-card__meta">{label}</div>
            <div className="project-card__item-title">{value}</div>
          </div>
        ))}
      </div>

      <div className="project-card__header">
        <h4>Hardware Validation</h4>
      </div>
      <div className="project-list">
        {validationItems.map((item, index) => (
          <div key={item} className="project-card__item">
            <div className="project-card__meta">Check {index + 1}</div>
            <div className="project-card__item-title">{item}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectHardwareTab;
