import { DEPENDENCY_SECTIONS } from "../../data/hardwareLibrary.js";

function DependenciesTab({ device }) {
  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Dependencies</h3>
      </div>
      <div className="project-list">
        {DEPENDENCY_SECTIONS.map((section) => (
          <div key={section} className="project-card__item">
            <div className="project-card__meta">{section}</div>
            <div className="project-card__item-title">
              {(device.dependencies?.[section] || []).join(", ") || "-"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default DependenciesTab;