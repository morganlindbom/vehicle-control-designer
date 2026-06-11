import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CATEGORY_OPTIONS,
  createDeviceId,
  createEmptyDevice,
} from "../data/hardwareLibrary.js";
import {
  createLibraryDevice,
  deleteLibraryDevice,
  fetchLibraryDevices,
} from "../services/libraryApi.js";

function HardwareLibraryPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        const response = await fetchLibraryDevices();
        if (active) {
          setDevices(response.devices || []);
        }
      } catch (nextError) {
        if (active) setError(nextError.message || "Failed to load hardware library.");
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(() => {
    return CATEGORY_OPTIONS.map((category) => ({
      ...category,
      count: devices.filter((device) => device.category === category.key).length,
    }));
  }, [devices]);

  const filteredDevices = useMemo(() => {
    const query = search.trim().toLowerCase();
    return devices.filter((device) => {
      const matchesCategory = selectedCategory === "all" || device.category === selectedCategory;
      const haystack = [device.name, device.manufacturer, device.partNumber, device.description, device.category]
        .join(" ")
        .toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });
  }, [devices, search, selectedCategory]);

  async function handleAddDevice() {
    const nextId = createDeviceId(`new-${Date.now()}`);
    const nextDevice = createEmptyDevice("Controller");
    nextDevice.id = nextId;
    nextDevice.name = "New Hardware Device";
    nextDevice.category = "controllers";

    await createLibraryDevice({
      ...nextDevice,
      specifications: nextDevice.specifications,
      generatorRules: nextDevice.generatorRules,
    });
    const response = await fetchLibraryDevices();
    setDevices(response.devices || []);
    navigate(`/library/hardware/${nextId}/edit`);
  }

  async function handleDeleteDevice(deviceId) {
    if (!window.confirm("Delete this hardware device and all of its files?")) return;
    await deleteLibraryDevice(deviceId);
    const response = await fetchLibraryDevices();
    setDevices(response.devices || []);
  }

  async function handleCloneDevice(device) {
    const nextId = createDeviceId(`${device.id}-clone-${Date.now()}`);
    await createLibraryDevice({
      ...device,
      id: nextId,
      name: `${device.name} Clone`,
    });
    const response = await fetchLibraryDevices();
    setDevices(response.devices || []);
    navigate(`/library/hardware/${nextId}/edit`);
  }

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Hardware Library</h2>
            <div className="project-card__actions">
              <button
                type="button"
                className="project-button project-button--primary"
                onClick={handleAddDevice}
              >
                Add Device
              </button>
            </div>
          </div>
          <p>
            Browse reusable hardware assets from the external library repository. Open a device to inspect it, or edit metadata in the dedicated edit page.
          </p>
        </div>

        <div className="project-details-grid">
          <article className="project-card">
            <div className="project-card__header">
              <h3>Categories</h3>
            </div>
            <div className="project-list">
              <button
                type="button"
                className={selectedCategory === "all" ? "project-button project-button--primary" : "project-button"}
                onClick={() => setSelectedCategory("all")}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className={selectedCategory === category.key ? "project-button project-button--primary" : "project-button"}
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </article>

          <article className="project-card">
            <div className="project-card__header">
              <h3>Search</h3>
            </div>
            <div className="project-field">
              <label htmlFor="hardware-search">Filter devices</label>
              <input
                id="hardware-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, category, manufacturer..."
              />
            </div>
            <p>{filteredDevices.length} device{filteredDevices.length === 1 ? "" : "s"} shown.</p>
            {error ? <p className="hardware-empty-state">{error}</p> : null}
          </article>
        </div>

        {loading ? <div className="hardware-empty-state">Loading hardware library...</div> : null}

        <div className="project-overview-grid">
          {filteredDevices.map((device) => (
            <article key={device.id} className="project-card">
              <div className="project-card__header">
                <h3>{device.name}</h3>
              </div>
              <div className="project-card__meta">{device.category}</div>
              <div className="project-card__item-title">{device.manufacturer || "No manufacturer"}</div>
              <div className="project-card__actions">
                <Link className="project-button project-button--primary" to={`/library/hardware/${device.id}`}>
                  View
                </Link>
                <Link className="project-button" to={`/library/hardware/${device.id}/edit`}>
                  Edit
                </Link>
                <button type="button" className="project-button" onClick={() => handleCloneDevice(device)}>
                  Clone
                </button>
                <button type="button" className="project-button project-button--danger" onClick={() => handleDeleteDevice(device.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default HardwareLibraryPage;
