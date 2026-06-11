import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DependenciesTab from "../components/hardwareDeviceTabs/DependenciesTab.jsx";
import FilesTab from "../components/hardwareDeviceTabs/FilesTab.jsx";
import GeneratorRulesTab from "../components/hardwareDeviceTabs/GeneratorRulesTab.jsx";
import OverviewTab from "../components/hardwareDeviceTabs/OverviewTab.jsx";
import NotesTab from "../components/hardwareDeviceTabs/NotesTab.jsx";
import SourceCodeTab from "../components/hardwareDeviceTabs/SourceCodeTab.jsx";
import SpecificationsTab from "../components/hardwareDeviceTabs/SpecificationsTab.jsx";
import { addProjectHardwareDevice, fetchLibraryDevice } from "../services/libraryApi.js";
import { normalizeLibraryDevice } from "../data/hardwareLibrary.js";

const tabLinks = [
  { key: "overview", label: "Overview" },
  { key: "specifications", label: "Specifications" },
  { key: "files", label: "Files" },
  { key: "source-code", label: "Source Code" },
  { key: "generator-rules", label: "Generator Rules" },
  { key: "dependencies", label: "Dependencies" },
  { key: "notes", label: "Notes" },
];

function HardwareDeviceDetailsPage() {
  const { deviceId, "*": restPath } = useParams();
  const navigate = useNavigate();
  const [device, setDevice] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDevice() {
      try {
        setLoading(true);
        const response = await fetchLibraryDevice(deviceId);
        if (active) {
          setDevice(normalizeLibraryDevice(response.device));
        }
      } catch {
        if (active) setDevice(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDevice();
    return () => {
      active = false;
    };
  }, [deviceId]);

  useEffect(() => {
    const nextTab =
      restPath === "specifications"
        ? "specifications"
        : restPath === "files"
          ? "files"
          : restPath === "source-code"
            ? "source-code"
            : restPath === "generator-rules"
              ? "generator-rules"
              : restPath === "dependencies"
                ? "dependencies"
                : "overview";

    setActiveTab(nextTab);
  }, [restPath]);

  function handleTabChange(tabKey) {
    setActiveTab(tabKey);
    navigate(`/library/hardware/${deviceId}${tabKey === "overview" ? "" : `/${tabKey}`}`);
  }

  async function handleAddToProject() {
    const response = await fetch("http://localhost:5000/api/projects");
    const projects = response.ok ? await response.json() : [];
    const projectNames = Array.isArray(projects) ? projects.map((project) => `${project.id}: ${project.name}`).join("\n") : "";
    const selectedProject = window.prompt(`Select project id:\n${projectNames}`);
    if (!selectedProject) return;
    await addProjectHardwareDevice(selectedProject, deviceId);
    window.alert(`Added ${device.name} to project ${selectedProject}.`);
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

  if (!device) {
    return (
      <main className="projects-page project-details-page">
        <section className="project-workspace">
          <div className="project-card project-card--full">
            <div className="project-card__header">
              <h2>Hardware Device Not Found</h2>
            </div>
            <p>The selected device no longer exists in the hardware library.</p>
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
            <h2>{device.name}</h2>
            <div className="project-card__actions">
              <button type="button" className="project-button" onClick={handleAddToProject}>
                Add To Project
              </button>
              <button type="button" className="project-button project-button--primary" onClick={() => navigate(`/library/hardware/${deviceId}/edit`)}>
                Edit Device
              </button>
            </div>
          </div>
          <p>
            Repository-backed hardware library data. Device type: {device.type}. Assets are read from the external library repository.
          </p>
        </div>

        <nav className="project-tabs" aria-label="Hardware device tabs">
          {tabLinks.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={activeTab === tab.key ? "project-tabs__link project-tabs__link--button project-tabs__link--active" : "project-tabs__link project-tabs__link--button"}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "overview" ? <OverviewTab device={device} /> : null}
        {activeTab === "specifications" ? <SpecificationsTab device={device} /> : null}
        {activeTab === "files" ? <FilesTab device={device} /> : null}
        {activeTab === "source-code" ? <SourceCodeTab device={device} /> : null}
        {activeTab === "generator-rules" ? <GeneratorRulesTab device={device} /> : null}
        {activeTab === "dependencies" ? <DependenciesTab device={device} /> : null}
        {activeTab === "notes" ? <NotesTab device={device} /> : null}
      </section>
    </main>
  );
}

export default HardwareDeviceDetailsPage;
