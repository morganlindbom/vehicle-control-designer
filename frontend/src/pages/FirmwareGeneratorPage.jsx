function FirmwareGeneratorPage() {
  const files = ["firmware.uf2", "build.log", "map.txt"];

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Firmware Generator</h2>
          </div>
          <div className="project-card__actions">
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Build Firmware
            </button>
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Generate UF2
            </button>
            <button
              type="button"
              className="project-button project-button--primary"
            >
              Download Firmware
            </button>
          </div>
        </div>

        <div className="project-details-grid">
          <article className="project-card">
            <h3>Target Hardware</h3>
            <div className="project-card__item">
              <div className="project-card__item-title">RP2350</div>
              <div className="project-card__meta">Ready</div>
            </div>
          </article>

          <article className="project-card">
            <h3>Build Status</h3>
            <div className="project-card__item">
              <div className="project-card__item-title">Ready</div>
              <div className="project-card__meta">Awaiting build action</div>
            </div>
          </article>
        </div>

        <div className="project-card project-card--full">
          <h3>Generated Files</h3>
          <div className="project-list">
            {files.map((file) => (
              <div key={file} className="project-card__item">
                <div className="project-card__item-title">{file}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default FirmwareGeneratorPage;
