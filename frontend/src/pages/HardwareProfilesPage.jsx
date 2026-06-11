function HardwareProfilesPage() {
  const sections = [
    { title: "Controllers", items: ["RP2040", "RP2350", "ESP32", "STM32"] },
    { title: "ADC Devices", items: ["MCP3008", "MCP3208", "ADS1115"] },
    { title: "PWM Drivers", items: ["IR4427", "TC4420", "Custom Driver"] },
  ];

  const resources = [
    ["ADC Channels", "16"],
    ["PWM Outputs", "12"],
    ["Digital Inputs", "24"],
    ["Digital Outputs", "24"],
  ];

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Hardware Profiles</h2>
          </div>
          <p>Define target hardware, device families, and resource capacity.</p>
        </div>

        <div className="project-overview-grid">
          {sections.map((section) => (
            <article key={section.title} className="project-card">
              <div className="project-card__header">
                <h3>{section.title}</h3>
              </div>
              <div className="project-list">
                {section.items.map((item) => (
                  <div key={item} className="project-card__item">
                    <div className="project-card__item-title">{item}</div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="project-overview-grid">
          {resources.map(([label, value]) => (
            <article key={label} className="project-card">
              <div className="project-card__meta">{label}</div>
              <div className="project-card__item-title">{value}</div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HardwareProfilesPage;
