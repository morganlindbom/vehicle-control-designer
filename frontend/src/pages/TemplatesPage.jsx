function TemplatesPage() {
  const sections = [
    {
      title: "Inputs",
      items: ["Throttle", "Brake"],
    },
    {
      title: "Sensors",
      items: [
        "Hall Sensor",
        "Wheel Speed Sensor",
        "Weight Sensor",
        "Temperature Sensor",
      ],
    },
    {
      title: "Controllers",
      items: [
        "Motor Controller",
        "Brake Controller",
        "Safety Controller",
        "Lighting Controller",
      ],
    },
    {
      title: "Outputs",
      items: [
        "Motor PWM",
        "Headlight PWM",
        "Brake Light PWM",
        "Horn",
        "Blinkers",
      ],
    },
  ];

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Templates</h2>
          </div>
          <p>Manage component templates for the vehicle control system.</p>
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
      </section>
    </main>
  );
}

export default TemplatesPage;
