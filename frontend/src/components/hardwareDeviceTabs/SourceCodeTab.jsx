import { SOURCE_CODE_SECTIONS } from "../../data/hardwareLibrary.js";

function SourceCodeTab({ device }) {
  const assetMap = {
    Source: device.assets?.source || [],
    Examples: device.assets?.examples || [],
  };

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Source Code</h3>
      </div>
      <div className="project-list">
        {SOURCE_CODE_SECTIONS.map((section) => (
          <div key={section} className="project-card__item">
            <div className="project-card__meta">{section}</div>
            <div className="hardware-asset-list">
              {assetMap[section].length ? assetMap[section].map((asset) => (
                <div key={asset} className="hardware-asset-list__item">
                  <span>{asset}</span>
                  <span className="hardware-asset-list__actions">View · Download</span>
                </div>
              )) : "-"}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SourceCodeTab;
