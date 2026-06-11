import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CATEGORY_OPTIONS,
  DEPENDENCY_SECTIONS,
  DEVICE_TYPES,
  FILE_SECTIONS,
  GENERATOR_RULES,
  SOURCE_CODE_SECTIONS,
  SPEC_TEMPLATES,
  buildDevicePayload,
  normalizeLibraryDevice,
} from "../data/hardwareLibrary.js";
import { fetchLibraryDevice, updateLibraryDevice } from "../services/libraryApi.js";

const editorTabs = [
  { key: "overview", label: "Overview" },
  { key: "specifications", label: "Specifications" },
  { key: "files", label: "Files" },
  { key: "source-code", label: "Source Code" },
  { key: "dependencies", label: "Dependencies" },
  { key: "generator-rules", label: "Generator Rules" },
];

function buildEditorState(device) {
  if (!device) return null;
  return {
    ...device,
    specifications: { ...(device.specifications || {}) },
    files: { ...(device.files || {}) },
    sourceCode: { ...(device.sourceCode || {}) },
    dependencies: { ...(device.dependencies || {}) },
    generatorRules: { ...(device.generatorRules || {}) },
  };
}

function HardwareDeviceEditPage() {
  const { deviceId } = useParams();
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDevice() {
      try {
        setLoading(true);
        const response = await fetchLibraryDevice(deviceId);
        if (active) {
          setDraft(buildEditorState(normalizeLibraryDevice(response.device)));
        }
      } catch (nextError) {
        if (active) setError(nextError.message || "Failed to load device.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDevice();
    return () => {
      active = false;
    };
  }, [deviceId]);

  const specKeys = useMemo(() => SPEC_TEMPLATES[draft?.type || "Controller"] || [], [draft?.type]);

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateSpec(field, value) {
    setDraft((current) => ({
      ...current,
      specifications: { ...current.specifications, [field]: value },
    }));
  }

  function updateList(section, key, value) {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value.split("\n").map((item) => item.trim()).filter(Boolean),
      },
    }));
  }

  function updateRule(rule, value) {
    setDraft((current) => ({
      ...current,
      generatorRules: { ...current.generatorRules, [rule]: value },
    }));
  }

  function updateAssetName(section, key, index, value) {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: (current[section]?.[key] || []).map((item, itemIndex) => (itemIndex === index ? value : item)),
      },
    }));
  }

  function addAsset(section, key) {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: [...(current[section]?.[key] || []), "New Asset"],
      },
    }));
  }

  function deleteAsset(section, key, index) {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: (current[section]?.[key] || []).filter((_, itemIndex) => itemIndex !== index),
      },
    }));
  }

  async function handleSave() {
    if (!draft) return;
    await updateLibraryDevice(deviceId, buildDevicePayload(draft));
    navigate(`/library/hardware/${draft.id}`);
  }

  if (loading) {
    return (
      <main className="projects-page project-details-page">
        <section className="project-workspace">
          <div className="project-card project-card--full">
            <p>Loading hardware device...</p>
          </div>
        </section>
      </main>
    );
  }

  if (error || !draft) {
    return (
      <main className="projects-page project-details-page">
        <section className="project-workspace">
          <div className="project-card project-card--full">
            <div className="project-card__header">
              <h2>Hardware Device Not Found</h2>
            </div>
            <p>{error || "The selected device no longer exists in the hardware library."}</p>
            <div className="project-card__actions">
              <button type="button" className="project-button project-button--primary" onClick={() => navigate("/library/hardware")}>
                Back to Hardware Library
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="projects-page project-details-page">
      <section className="project-workspace">
        <div className="project-card project-card--full">
          <div className="project-card__header">
            <h2>Edit Hardware Device</h2>
            <div className="project-card__actions">
              <button type="button" className="project-button project-button--primary" onClick={handleSave}>
                Save Device
              </button>
              <button type="button" className="project-button" onClick={() => navigate(`/library/hardware/${draft.id}`)}>
                Cancel
              </button>
            </div>
          </div>
          <p>
            Edit one hardware category at a time. Files and source code are managed as repository assets.
          </p>
        </div>

        <nav className="project-tabs" aria-label="Hardware device editor tabs">
          {editorTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTab === tab.key ? "project-tabs__link project-tabs__link--button project-tabs__link--active" : "project-tabs__link project-tabs__link--button"}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "overview" ? (
          <article className="project-card project-card--full">
            <div className="project-card__header"><h3>Overview</h3></div>
            <div className="project-overview-grid">
              <div className="project-field">
                <label>Name</label>
                <input value={draft.name} onChange={(event) => updateField("name", event.target.value)} />
              </div>
              <div className="project-field">
                <label>Category</label>
                <select value={draft.category || "controllers"} onChange={(event) => updateField("category", event.target.value)}>
                  {CATEGORY_OPTIONS.map((category) => (
                    <option key={category.key} value={category.key}>{category.label}</option>
                  ))}
                </select>
              </div>
              <div className="project-field">
                <label>Device Type</label>
                <select value={draft.type} onChange={(event) => updateField("type", event.target.value)}>
                  {DEVICE_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="project-field">
                <label>Manufacturer</label>
                <input value={draft.manufacturer} onChange={(event) => updateField("manufacturer", event.target.value)} />
              </div>
              <div className="project-field">
                <label>Part Number</label>
                <input value={draft.partNumber} onChange={(event) => updateField("partNumber", event.target.value)} />
              </div>
              <div className="project-field">
                <label>Description</label>
                <textarea rows="5" value={draft.description} onChange={(event) => updateField("description", event.target.value)} />
              </div>
            </div>
          </article>
        ) : null}

        {activeTab === "specifications" ? (
          <article className="project-card">
            <div className="project-card__header"><h3>Specifications</h3></div>
            <div className="project-list">
              {specKeys.map((key) => (
                <div key={key} className="project-card__item">
                  <div className="project-card__meta">{key}</div>
                  <input value={draft.specifications?.[key] || ""} onChange={(event) => updateSpec(key, event.target.value)} />
                </div>
              ))}
            </div>
          </article>
        ) : null}

        {activeTab === "files" ? (
          <article className="project-card">
            <div className="project-card__header"><h3>Files</h3></div>
            <div className="hardware-asset-grid">
              {FILE_SECTIONS.map((section) => (
                <section key={section} className="hardware-asset-card">
                  <div className="hardware-asset-card__header">
                    <div>
                      <h4>{section}</h4>
                      <p>Discovered repository files.</p>
                    </div>
                    <button type="button" className="project-button project-button--primary" onClick={() => addAsset("files", section)}>
                      Upload
                    </button>
                  </div>
                  <div className="hardware-asset-card__list">
                    {(draft.files?.[section] || []).map((assetName, index) => (
                      <div key={`${section}-${index}`} className="hardware-asset-item">
                        <input value={assetName} onChange={(event) => updateAssetName("files", section, index, event.target.value)} />
                        <div className="project-card__actions">
                          <button type="button" className="project-button">Download</button>
                          <button type="button" className="project-button project-button--danger" onClick={() => deleteAsset("files", section, index)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        ) : null}

        {activeTab === "source-code" ? (
          <article className="project-card">
            <div className="project-card__header"><h3>Source Code</h3></div>
            <div className="hardware-asset-grid">
              {SOURCE_CODE_SECTIONS.map((section) => (
                <section key={section} className="hardware-asset-card">
                  <div className="hardware-asset-card__header">
                    <div>
                      <h4>{section}</h4>
                      <p>Repository source and examples.</p>
                    </div>
                    <button type="button" className="project-button project-button--primary" onClick={() => addAsset("sourceCode", section)}>
                      Add Asset
                    </button>
                  </div>
                  <div className="hardware-asset-card__list">
                    {(draft.sourceCode?.[section] || []).map((assetName, index) => (
                      <div key={`${section}-${index}`} className="hardware-asset-item">
                        <input value={assetName} onChange={(event) => updateAssetName("sourceCode", section, index, event.target.value)} />
                        <div className="project-card__actions">
                          <button type="button" className="project-button">Download</button>
                          <button type="button" className="project-button project-button--danger" onClick={() => deleteAsset("sourceCode", section, index)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </article>
        ) : null}

        {activeTab === "dependencies" ? (
          <article className="project-card">
            <div className="project-card__header"><h3>Dependencies</h3></div>
            <div className="project-list">
              {DEPENDENCY_SECTIONS.map((section) => (
                <div key={section} className="project-card__item">
                  <div className="project-card__meta">{section}</div>
                  <textarea rows="3" value={(draft.dependencies?.[section] || []).join("\n")} onChange={(event) => updateList("dependencies", section, event.target.value)} />
                </div>
              ))}
            </div>
          </article>
        ) : null}

        {activeTab === "generator-rules" ? (
          <article className="project-card">
            <div className="project-card__header"><h3>Generator Rules</h3></div>
            <div className="project-list">
              <div className="project-card__item">
                <div className="project-card__meta">rules.json</div>
                <textarea rows="4" value={JSON.stringify(draft.generatorRules?.rules || {}, null, 2)} readOnly />
              </div>
              <div className="project-card__item">
                <div className="project-card__meta">extracted-text.txt</div>
                <textarea rows="4" value={draft.generatorRules?.["extracted-text"] || ""} onChange={(event) => updateRule("extracted-text", event.target.value)} />
              </div>
              <div className="project-card__item">
                <div className="project-card__meta">ai-summary.txt</div>
                <textarea rows="4" value={draft.generatorRules?.["ai-summary"] || ""} onChange={(event) => updateRule("ai-summary", event.target.value)} />
              </div>
            </div>
          </article>
        ) : null}
      </section>
    </main>
  );
}

export default HardwareDeviceEditPage;
