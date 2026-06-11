function JsonPreviewPage() {
  const json = JSON.stringify(
    {
      project: {},
      components: [],
      connections: [],
    },
    null,
    2,
  );

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>JSON Preview</h2>
          </div>
          <div className="project-card__actions">
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Validate JSON
            </button>
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Copy JSON
            </button>
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Export JSON
            </button>
          </div>
        </div>

        <div className="project-details-grid">
          <article className="project-card">
            <h3>Project Selector</h3>
            <div className="project-card__item">
              <div className="project-card__item-title">Scooter V1</div>
              <div className="project-card__meta">Selected</div>
            </div>
          </article>

          <article className="project-card">
            <h3>Validation Status</h3>
            <div className="project-card__item">
              <div className="project-card__item-title">Ready</div>
              <div className="project-card__meta">
                Structure available for export
              </div>
            </div>
          </article>
        </div>

        <div className="project-card project-card--full">
          <h3>Generated JSON</h3>
          <pre className="project-code-panel">{json}</pre>
        </div>
      </section>
    </main>
  );
}

export default JsonPreviewPage;
