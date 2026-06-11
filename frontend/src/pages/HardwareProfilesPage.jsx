function HardwareProfilesPage() {
  const sections = [
    { title: "Controllers", items: ["RP2040", "RP2350", "ESP32", "STM32"] },
    { title: "ADC Devices", items: ["MCP3008", "MCP3208", "ADS1115"] },
    { title: "PWM Drivers", items: ["IR4427", "TC4420", "Custom Driver"] },
    { title: "Sensors", items: ["IMU", "Wheel Encoder", "Pressure Sensor"] },
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
          <p>
            Define target hardware, device families, and resource capacity.
            Build profiles that can grow with the vehicle instead of being fixed
            to one board.
          </p>
        </div>

        <div className="project-overview-grid">
          <article className="project-card">
            <div className="project-card__header">
              <h3>Platform Fit</h3>
            </div>
            <div className="project-card__item-title">
              Match controllers to the vehicle type, pin count, and real-time
              control needs.
            </div>
          </article>
          <article className="project-card">
            <div className="project-card__header">
              <h3>Electrical Budget</h3>
            </div>
            <div className="project-card__item-title">
              Track voltage rails, current draw, and spare capacity before
              adding new modules.
            </div>
          </article>
          <article className="project-card">
            <div className="project-card__header">
              <h3>Expansion Plan</h3>
            </div>
            <div className="project-card__item-title">
              Keep space for future IO, communications, and safety hardware
              without redesigning the board.
            </div>
          </article>
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

        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h3>Build Checklist</h3>
          </div>
          <div className="project-list">
            <div className="project-card__item">
              <div className="project-card__meta">Step 1</div>
              <div className="project-card__item-title">
                Define the target controller family and board revision.
              </div>
            </div>
            <div className="project-card__item">
              <div className="project-card__meta">Step 2</div>
              <div className="project-card__item-title">
                Map every sensor, actuator, and bus to a hardware profile.
              </div>
            </div>
            <div className="project-card__item">
              <div className="project-card__meta">Step 3</div>
              <div className="project-card__item-title">
                Reserve spare ADC, PWM, and digital IO for future growth.
              </div>
            </div>
            <div className="project-card__item">
              <div className="project-card__meta">Step 4</div>
              <div className="project-card__item-title">
                Document power rail limits and required protection circuits.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default HardwareProfilesPage;
