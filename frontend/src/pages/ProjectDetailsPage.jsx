import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";
import ProjectArchitectureTab from "../components/projectTabs/ProjectArchitectureTab.jsx";
import ProjectHardwareTab from "../components/projectTabs/ProjectHardwareTab.jsx";
import ProjectJsonTab from "../components/projectTabs/ProjectJsonTab.jsx";
import ProjectOverviewTab from "../components/projectTabs/ProjectOverviewTab.jsx";
import ProjectValidationTab from "../components/projectTabs/ProjectValidationTab.jsx";
import "../styles/projectDetails.css";

function ProjectDetailsPage() {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [addingTemplateId, setAddingTemplateId] = useState("");
  const [connectionForm, setConnectionForm] = useState({ from: "", to: "" });
  const [creatingConnection, setCreatingConnection] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState("");
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentForm, setComponentForm] = useState({
    name: "",
  });
  const [savingComponent, setSavingComponent] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [pendingDeleteComponent, setPendingDeleteComponent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [componentsLoading, setComponentsLoading] = useState(true);
  const [addError, setAddError] = useState("");
  const [connectionError, setConnectionError] = useState("");
  const [componentError, setComponentError] = useState("");
  const [error, setError] = useState("");

  function snapshotState() {
    return {
      components,
      connections,
      selectedComponentId,
      selectedComponent,
      componentForm,
      connectionForm,
    };
  }

  function restoreSnapshot(snapshot) {
    setComponents(snapshot.components);
    setConnections(snapshot.connections);
    setSelectedComponentId(snapshot.selectedComponentId);
    setSelectedComponent(snapshot.selectedComponent);
    setComponentForm(snapshot.componentForm);
    setConnectionForm(snapshot.connectionForm);
  }

  function pushUndoSnapshot() {
    setUndoStack((current) => [...current, snapshotState()]);
    setRedoStack([]);
  }

  function getDefaultValuesForTemplate(templateId) {
    const template = templates.find((item) => item.id === templateId);
    const schema = template?.propertySchema || {};

    return Object.entries(schema).reduce((properties, [key, definition]) => {
      properties[key] = String(definition.default ?? "");
      return properties;
    }, {});
  }

  useEffect(() => {
    let isActive = true;

    async function loadProjectData() {
      try {
        const [projectResponse, templatesResponse, componentsResponse] =
          await Promise.all([
            fetch(`http://localhost:5000/api/projects/${id}`),
            fetch("http://localhost:5000/api/templates"),
            fetch(`http://localhost:5000/api/projects/${id}/components`),
          ]);

        if (
          !projectResponse.ok ||
          !templatesResponse.ok ||
          !componentsResponse.ok
        ) {
          throw new Error("Failed to load project data");
        }

        const [projectData, templatesData, componentsData] = await Promise.all([
          projectResponse.json(),
          templatesResponse.json(),
          componentsResponse.json(),
        ]);

        const connectionsResponse = await fetch(
          `http://localhost:5000/api/projects/${id}/connections`,
        );

        if (!connectionsResponse.ok) {
          throw new Error("Failed to load project data");
        }

        const connectionsData = await connectionsResponse.json();

        if (isActive) {
          setProject(projectData);
          setTemplates(templatesData);
          setComponents(componentsData);
          setConnections(connectionsData);
          setSelectedComponentId("");
          setSelectedComponent(null);
          setComponentForm({ name: "", min: "", max: "", deadzone: "" });
          setConnectionForm({ from: "", to: "" });
          setError("");
          setAddError("");
          setConnectionError("");
          setComponentError("");
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
          setComponentsLoading(false);
        }
      }
    }

    loadProjectData();

    return () => {
      isActive = false;
    };
  }, [id]);

  async function refreshComponents() {
    setComponentsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/components`,
      );

      if (!response.ok) {
        throw new Error("Failed to load project components");
      }

      const data = await response.json();

      setComponents(data);
      if (selectedComponentId) {
        const nextSelected = data.find(
          (component) => component.id === selectedComponentId,
        );
        if (nextSelected) {
          setSelectedComponent(nextSelected);
          setComponentForm({
            name: nextSelected.name,
            min: String(nextSelected.properties?.min ?? ""),
            max: String(nextSelected.properties?.max ?? ""),
            deadzone: String(nextSelected.properties?.deadzone ?? ""),
          });
        }
      }
    } catch {
      setAddError("Failed to create component");
    } finally {
      setComponentsLoading(false);
    }
  }

  async function refreshConnections() {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/connections`,
      );

      if (!response.ok) {
        throw new Error("Failed to load connections");
      }

      const data = await response.json();
      setConnections(data);
    } catch {
      setConnectionError("Failed to load connections");
    }
  }

  async function handleSelectComponent(componentId) {
    setSelectedComponentId(componentId);
    setComponentError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/components/${componentId}`,
      );

      if (!response.ok) {
        throw new Error("Failed to load component details");
      }

      const data = await response.json();

      setSelectedComponent(data);
      setComponentForm({
        name: data.name,
        ...Object.entries(data.properties || {}).reduce(
          (properties, [key, value]) => {
            properties[key] = String(value);
            return properties;
          },
          {},
        ),
      });
    } catch {
      setComponentError("Failed to load component details");
    }
  }

  async function handleAddComponent(templateId) {
    pushUndoSnapshot();
    setAddingTemplateId(templateId);
    setAddError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/components`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ templateId }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create component");
      }

      await refreshComponents();
      await refreshConnections();
    } catch {
      setAddError("Failed to create component");
    } finally {
      setAddingTemplateId("");
    }
  }

  async function handleSaveComponent() {
    if (!selectedComponent) {
      return;
    }

    const schema = templates.find(
      (template) => template.id === selectedComponent.templateId,
    )?.propertySchema;

    const nextProperties = Object.keys(schema || {}).reduce(
      (properties, key) => {
        properties[key] = Number(componentForm[key]);
        return properties;
      },
      {},
    );

    if (
      Object.hasOwn(nextProperties, "min") &&
      Object.hasOwn(nextProperties, "max") &&
      Number(nextProperties.min) > Number(nextProperties.max)
    ) {
      setComponentError("Invalid property values");
      return;
    }

    pushUndoSnapshot();
    setSavingComponent(true);
    setComponentError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/components/${selectedComponent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: componentForm.name,
            properties: nextProperties,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save component");
      }

      const updatedComponent = await response.json();
      setSelectedComponent(updatedComponent);
      setComponentForm({
        name: updatedComponent.name,
        ...Object.entries(updatedComponent.properties || {}).reduce(
          (properties, [key, value]) => {
            properties[key] = String(value);
            return properties;
          },
          {},
        ),
      });
      await refreshComponents();
    } catch {
      setComponentError("Failed to save component");
    } finally {
      setSavingComponent(false);
    }
  }

  async function handleCreateConnection() {
    if (!connectionForm.from || !connectionForm.to) {
      setConnectionError("Failed to create connection");
      return;
    }

    pushUndoSnapshot();
    setCreatingConnection(true);
    setConnectionError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/connections`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(connectionForm),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to create connection");
      }

      await refreshConnections();
      setConnectionForm({ from: "", to: "" });
    } catch {
      setConnectionError("Failed to create connection");
    } finally {
      setCreatingConnection(false);
    }
  }

  async function handleRemoveConnection(connectionId) {
    pushUndoSnapshot();
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/connections/${connectionId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to remove connection");
      }

      await refreshConnections();
    } catch {
      setConnectionError("Failed to remove connection");
    }
  }

  function getComponentName(componentId) {
    return (
      components.find((component) => component.id === componentId)?.name ||
      componentId
    );
  }

  async function handleResetToDefaults() {
    if (!selectedComponent) {
      return;
    }

    pushUndoSnapshot();

    const defaults = getDefaultValuesForTemplate(selectedComponent.templateId);
    setComponentForm({
      name: selectedComponent.name,
      ...defaults,
    });
  }

  async function handleDeleteSelectedComponent() {
    if (!selectedComponent) {
      return;
    }

    pushUndoSnapshot();

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}/components/${selectedComponent.id}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete component");
      }

      setPendingDeleteComponent(null);
      setSelectedComponentId("");
      setSelectedComponent(null);
      setComponentForm({ name: "" });
      await refreshComponents();
      await refreshConnections();
    } catch {
      setComponentError("Failed to delete component");
    }
  }

  function handleUndo() {
    if (!undoStack.length) {
      return;
    }

    const previousSnapshot = undoStack.at(-1);
    setUndoStack((current) => current.slice(0, -1));
    setRedoStack((current) => [...current, snapshotState()]);
    restoreSnapshot(previousSnapshot);
  }

  function handleRedo() {
    if (!redoStack.length) {
      return;
    }

    const nextSnapshot = redoStack.at(-1);
    setRedoStack((current) => current.slice(0, -1));
    setUndoStack((current) => [...current, snapshotState()]);
    restoreSnapshot(nextSnapshot);
  }

  function getActiveTab() {
    if (location.pathname.endsWith("/architecture")) {
      return "architecture";
    }

    if (location.pathname.endsWith("/hardware")) {
      return "hardware";
    }

    if (location.pathname.endsWith("/validation")) {
      return "validation";
    }

    if (location.pathname.endsWith("/json")) {
      return "json";
    }

    return "overview";
  }

  const activeTab = getActiveTab();

  let content;

  if (loading) {
    content = <p>Loading project...</p>;
  } else if (error) {
    content = <p>{error}</p>;
  } else if (project) {
    content = (
      <div className="project-workspace">
        <div className="project-workspace__header">
          <div className="project-workspace__titleblock">
            <div className="project-workspace__breadcrumb">
              <Link to="/projects">Projects</Link>
              <span>&gt;</span>
              <span>{project.name}</span>
            </div>
            <h2>{project.name}</h2>
            <p className="project-card__meta">Project Workspace</p>
          </div>
          <Link className="project-button" to="/projects">
            Back to projects
          </Link>
        </div>

        <nav className="project-tabs" aria-label="Project workspace tabs">
          <NavLink end to={`/projects/${id}`} className="project-tabs__link">
            Overview
          </NavLink>
          <NavLink
            to={`/projects/${id}/architecture`}
            className="project-tabs__link"
          >
            Architecture
          </NavLink>
          <NavLink
            to={`/projects/${id}/hardware`}
            className="project-tabs__link"
          >
            Hardware
          </NavLink>
          <NavLink
            to={`/projects/${id}/validation`}
            className="project-tabs__link"
          >
            Validation
          </NavLink>
          <NavLink to={`/projects/${id}/json`} className="project-tabs__link">
            Generated JSON
          </NavLink>
        </nav>

        {activeTab === "overview" ? (
          <ProjectOverviewTab
            project={project}
            components={components}
            connections={connections}
          />
        ) : null}

        {activeTab === "architecture" ? (
          <ProjectArchitectureTab
            templates={templates}
            components={components}
            connections={connections}
            addingTemplateId={addingTemplateId}
            componentsLoading={componentsLoading}
            connectionForm={connectionForm}
            creatingConnection={creatingConnection}
            selectedComponent={selectedComponent}
            componentForm={componentForm}
            savingComponent={savingComponent}
            pendingDeleteComponent={pendingDeleteComponent}
            undoStack={undoStack}
            redoStack={redoStack}
            addError={addError}
            connectionError={connectionError}
            componentError={componentError}
            onAddComponent={handleAddComponent}
            onSelectComponent={handleSelectComponent}
            onConnectionFormChange={(field, value) =>
              setConnectionForm((current) => ({ ...current, [field]: value }))
            }
            onCreateConnection={handleCreateConnection}
            onRemoveConnection={handleRemoveConnection}
            onComponentFormChange={(field, value) =>
              setComponentForm((current) => ({ ...current, [field]: value }))
            }
            onSaveComponent={handleSaveComponent}
            onResetToDefaults={handleResetToDefaults}
            onSetPendingDeleteComponent={setPendingDeleteComponent}
            onDeleteSelectedComponent={handleDeleteSelectedComponent}
            onUndo={handleUndo}
            onRedo={handleRedo}
            getComponentName={getComponentName}
          />
        ) : null}

        {activeTab === "hardware" ? <ProjectHardwareTab /> : null}
        {activeTab === "validation" ? <ProjectValidationTab /> : null}
        {activeTab === "json" ? (
          <ProjectJsonTab
            project={project}
            components={components}
            connections={connections}
          />
        ) : null}
      </div>
    );
  } else {
    content = null;
  }

  return (
    <main className="projects-page project-details-page">
      <section className="project-card project-card--full">{content}</section>
    </main>
  );
}

export default ProjectDetailsPage;
