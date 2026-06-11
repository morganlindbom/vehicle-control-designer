function ProjectValidationTab() {
  const cards = [
    { title: "Errors", meta: "Throttle not connected" },
    { title: "Warnings", meta: "Brake overrides throttle" },
    { title: "Information", meta: "PWM frequency = 25 kHz" },
    { title: "Information", meta: "ADC capacity available" },
  ];

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Validation</h3>
      </div>
      <div className="project-overview-grid">
        {cards.map((card) => (
          <div key={card.title + card.meta} className="project-card__item">
            <div className="project-card__item-title">{card.title}</div>
            <div className="project-card__meta">{card.meta}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectValidationTab;
