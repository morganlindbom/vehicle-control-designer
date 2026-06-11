function CodeGeneratorPage() {
  const code = `class Throttle
{
};

class MotorPWM
{
};`;

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Code Generator</h2>
          </div>
          <div className="project-card__actions">
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Generate Code
            </button>
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Download Source
            </button>
          </div>
        </div>

        <div className="project-details-grid">
          <article className="project-card">
            <h3>Target Platform</h3>
            <div className="project-card__item">
              <div className="project-card__item-title">Embedded C++</div>
              <div className="project-card__meta">
                Desktop preview for generated source
              </div>
            </div>
          </article>

          <article className="project-card">
            <h3>Generation Status</h3>
            <div className="project-card__item">
              <div className="project-card__item-title">Ready</div>
              <div className="project-card__meta">Source preview available</div>
            </div>
          </article>
        </div>

        <div className="project-card project-card--full">
          <h3>Code Preview</h3>
          <pre className="project-code-panel">{code}</pre>
        </div>
      </section>
    </main>
  );
}

export default CodeGeneratorPage;
