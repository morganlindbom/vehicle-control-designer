function ProjectJsonTab({ project, components, connections }) {
  const data = JSON.stringify(
    {
      project: { id: project.id, name: project.name },
      components,
      connections,
    },
    null,
    2,
  );

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Generated JSON</h3>
      </div>
      <div className="project-card__actions">
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
        <button
          type="button"
          className="project-button project-button--primary"
        >
          Validate JSON
        </button>
      </div>
      <pre className="project-code-panel">{data}</pre>
    </section>
  );
}

export default ProjectJsonTab;
