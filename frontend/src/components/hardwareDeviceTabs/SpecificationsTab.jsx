import { SPEC_TEMPLATES } from "../../data/hardwareLibrary.js";

function SpecificationsTab({ device }) {
  const specKeys = SPEC_TEMPLATES[device.type] || [];

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Specifications</h3>
      </div>
      <div className="project-list">
        {specKeys.map((key) => (
          <div key={key} className="project-card__item">
            <div className="project-card__meta">{key}</div>
            <div className="project-card__item-title">{device.specifications?.[key] || "-"}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SpecificationsTab;
