import { FILE_SECTIONS } from "../../data/hardwareLibrary.js";

function FilesTab({ device }) {
  const assetMap = {
    Datasheets: device.assets?.datasheets || [],
    Pinouts: device.assets?.pinouts || [],
    Schematics: device.assets?.schematics || [],
    Images: device.assets?.images || [],
  };

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Files</h3>
      </div>
      <div className="project-list">
        {FILE_SECTIONS.map((section) => (
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

export default FilesTab;
