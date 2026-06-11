function ProjectValidationPage() {
  const sections = [
    {
      title: "Errors",
      items: ["Throttle not connected"],
    },
    {
      title: "Warnings",
      items: ["Brake override active"],
    },
    {
      title: "Information",
      items: ["PWM frequency valid", "ADC capacity available"],
    },
  ];

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Validation</h2>
          </div>
          <p>
            Review validation status, resource usage, and connection health.
          </p>
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

export default ProjectValidationPage;
