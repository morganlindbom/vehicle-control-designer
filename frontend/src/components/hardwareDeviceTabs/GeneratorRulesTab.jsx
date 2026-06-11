function GeneratorRulesTab({ device }) {
  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Generator Rules</h3>
      </div>
      <div className="project-list">
        <div className="project-card__item">
          <div className="project-card__meta">rules.json</div>
          <div className="project-card__item-title">{JSON.stringify(device.generatorRules?.rules || {}, null, 2) || "-"}</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">extracted-text.txt</div>
          <div className="project-card__item-title">{device.generatorRules?.["extracted-text"] || "-"}</div>
        </div>
        <div className="project-card__item">
          <div className="project-card__meta">ai-summary.txt</div>
          <div className="project-card__item-title">{device.generatorRules?.["ai-summary"] || "-"}</div>
        </div>
      </div>
      <p>Placeholder implementation for future JSON, C++, and firmware generation.</p>
    </section>
  );
}

export default GeneratorRulesTab;
