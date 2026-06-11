import { useEffect, useMemo, useState } from "react";
import { addProjectHardwareDevice, fetchLibraryDevices, fetchProjectHardware, removeProjectHardwareDevice } from "../../services/libraryApi.js";
import { CATEGORY_OPTIONS } from "../../data/hardwareLibrary.js";

function ProjectHardwareTab() {
  const projectId = 1;
  const [devices, setDevices] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load() {
      const [deviceResponse, projectResponse] = await Promise.all([
        fetchLibraryDevices(),
        fetchProjectHardware(projectId),
      ]);

      if (active) {
        setDevices(deviceResponse.devices || []);
        setSelectedDevices(projectResponse.devices || []);
        setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const selectedDeviceMap = useMemo(() => {
    return selectedDevices.reduce((map, deviceId) => {
      map[deviceId] = true;
      return map;
    }, {});
  }, [selectedDevices]);

  async function handleAdd(deviceId) {
    await addProjectHardwareDevice(projectId, deviceId);
    const response = await fetchProjectHardware(projectId);
    setSelectedDevices(response.devices || []);
  }

  async function handleRemove(deviceId) {
    if (!window.confirm("Remove this device from the project?")) return;
    await removeProjectHardwareDevice(projectId, deviceId);
    const response = await fetchProjectHardware(projectId);
    setSelectedDevices(response.devices || []);
  }

  const grouped = CATEGORY_OPTIONS.reduce((groups, category) => {
    groups[category.key] = devices.filter((device) => device.category === category.key);
    return groups;
  }, {});

  if (loading) {
    return (
      <section className="project-card project-card--full">
        <p>Loading project hardware...</p>
      </section>
    );
  }

  return (
    <section className="project-card project-card--full">
      <div className="project-card__header">
        <h3>Hardware</h3>
      </div>
      <p>
        Configure hardware for this project. Global hardware definitions are managed in the Library Workspace.
      </p>

      {CATEGORY_OPTIONS.map((category) => (
        <div key={category.key} className="project-card">
          <div className="project-card__header">
            <h4>{category.label}</h4>
          </div>
          <div className="project-list">
            {(grouped[category.key] || []).map((device) => (
              <div key={device.id} className="project-card__item">
                <div className="project-card__item-title">{device.name}</div>
                <div className="project-card__meta">{device.manufacturer}</div>
                <div className="project-card__actions">
                  {selectedDeviceMap[device.id] ? (
                    <button type="button" className="project-button project-button--danger" onClick={() => handleRemove(device.id)}>
                      Remove From Project
                    </button>
                  ) : (
                    <button type="button" className="project-button project-button--primary" onClick={() => handleAdd(device.id)}>
                      Add To Project
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default ProjectHardwareTab;
