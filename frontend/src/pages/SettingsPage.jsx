function SettingsPage() {
  const sections = [
    { title: "Appearance", items: ["Theme", "Dark Mode"] },
    { title: "Generator", items: ["Default Target", "Default Language"] },
    { title: "Project", items: ["Autosave", "Undo History Size"] },
  ];

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Settings</h2>
          </div>
          <p>Configure appearance, generator defaults, and project behavior.</p>
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

export default SettingsPage;
