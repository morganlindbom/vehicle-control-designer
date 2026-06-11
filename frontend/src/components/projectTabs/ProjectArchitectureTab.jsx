import ProjectFlow from "../ProjectFlow.jsx";

function ProjectArchitectureTab({
  templates,
  components,
  connections,
  addingTemplateId,
  componentsLoading,
  connectionForm,
  creatingConnection,
  selectedComponent,
  componentForm,
  savingComponent,
  pendingDeleteComponent,
  undoStack,
  redoStack,
  addError,
  connectionError,
  componentError,
  onAddComponent,
  onSelectComponent,
  onConnectionFormChange,
  onCreateConnection,
  onRemoveConnection,
  onComponentFormChange,
  onSaveComponent,
  onResetToDefaults,
  onSetPendingDeleteComponent,
  onDeleteSelectedComponent,
  onUndo,
  onRedo,
  getComponentName,
}) {
  return (
    <>
      <div className="project-details-grid">
        <section className="project-card">
          <div className="project-card__header">
            <h3>Component Library</h3>
          </div>
          <ul className="project-list">
            {templates.map((template) => (
              <li key={template.id} className="project-card__item">
                <div className="project-card__item-title">{template.name}</div>
                <div className="project-card__meta">
                  Category: {template.category}
                </div>
                <div className="project-card__actions">
                  <button
                    type="button"
                    className="project-button project-button--primary"
                    onClick={() => onAddComponent(template.id)}
                    disabled={addingTemplateId === template.id}
                  >
                    {addingTemplateId === template.id
                      ? "Adding..."
                      : "Add Component"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="project-card">
          <div className="project-card__header">
            <h3>Project Components</h3>
          </div>
          {componentsLoading ? (
            <p>Loading components...</p>
          ) : (
            <ul className="project-card__list">
              {components.map((component) => (
                <li key={component.id} className="project-card__item">
                  <div className="project-card__item-title">
                    {component.name}
                  </div>
                  <div className="project-card__meta">
                    Template: {component.templateId}
                  </div>
                  <div className="project-card__actions">
                    <button
                      type="button"
                      className="project-button"
                      onClick={() => onSelectComponent(component.id)}
                    >
                      Select
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="project-details-grid project-details-grid--secondary">
        <section className="project-card">
          <div className="project-card__header">
            <h3>Connections</h3>
          </div>
          <div className="project-field">
            <label>From Component</label>
            <select
              value={connectionForm.from}
              onChange={(event) =>
                onConnectionFormChange("from", event.target.value)
              }
            >
              <option value="">Select component</option>
              {components.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
          </div>
          <div className="project-field">
            <label>To Component</label>
            <select
              value={connectionForm.to}
              onChange={(event) =>
                onConnectionFormChange("to", event.target.value)
              }
            >
              <option value="">Select component</option>
              {components.map((component) => (
                <option key={component.id} value={component.id}>
                  {component.name}
                </option>
              ))}
            </select>
          </div>
          <div className="project-card__actions">
            <button
              type="button"
              className="project-button project-button--primary"
              onClick={onCreateConnection}
              disabled={creatingConnection}
            >
              {creatingConnection ? "Creating..." : "Create Connection"}
            </button>
          </div>
          <ul className="project-card__list">
            {connections.map((connection) => (
              <li key={connection.id} className="project-card__item">
                <div className="project-card__item-title">
                  {getComponentName(connection.from)}
                </div>
                <div className="project-card__meta">↓</div>
                <div className="project-card__item-title">
                  {getComponentName(connection.to)}
                </div>
                <div className="project-card__actions">
                  <button
                    type="button"
                    className="project-button project-button--danger"
                    onClick={() => onRemoveConnection(connection.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="project-card">
          <div className="project-card__header">
            <h3>Component Details</h3>
          </div>
          {selectedComponent ? (
            <div>
              <div className="project-field">
                <label>Name</label>
                <input
                  value={componentForm.name}
                  onChange={(event) =>
                    onComponentFormChange("name", event.target.value)
                  }
                />
              </div>
              {Object.keys(selectedComponent.properties || {}).map((key) => (
                <div className="project-field" key={key}>
                  <label>
                    {key
                      .replace(/([a-z])([A-Z])/g, "$1 $2")
                      .replace(/^./, (character) => character.toUpperCase())}
                  </label>
                  <input
                    type="number"
                    value={
                      componentForm[key] ??
                      selectedComponent.properties?.[key] ??
                      ""
                    }
                    onChange={(event) =>
                      onComponentFormChange(key, event.target.value)
                    }
                  />
                </div>
              ))}
              <div className="project-card__actions">
                <button
                  type="button"
                  className="project-button project-button--primary"
                  onClick={onSaveComponent}
                  disabled={savingComponent}
                >
                  {savingComponent ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="project-button"
                  onClick={onResetToDefaults}
                >
                  Reset To Defaults
                </button>
                <button
                  type="button"
                  className="project-button project-button--danger"
                  onClick={() => onSetPendingDeleteComponent(selectedComponent)}
                >
                  Delete Component
                </button>
              </div>
            </div>
          ) : (
            <p>Select a component to edit.</p>
          )}
        </section>
      </div>

      <section className="project-card project-card--full">
        <div className="project-card__header">
          <h3>Visual Architecture</h3>
          <div className="project-card__actions">
            <button
              type="button"
              className="project-button"
              onClick={onUndo}
              disabled={!undoStack.length}
            >
              Undo
            </button>
            <button
              type="button"
              className="project-button"
              onClick={onRedo}
              disabled={!redoStack.length}
            >
              Redo
            </button>
          </div>
        </div>
        <div className="project-architecture-shell">
          <ProjectFlow
            components={components}
            connections={connections}
            templates={templates}
          />
        </div>
      </section>

      {pendingDeleteComponent ? (
        <section className="project-card project-card--full">
          <div className="project-card__header">
            <h3>Confirm Delete</h3>
          </div>
          <p>Delete {pendingDeleteComponent.name}?</p>
          <div className="project-card__actions">
            <button
              type="button"
              className="project-button project-button--danger"
              onClick={onDeleteSelectedComponent}
            >
              Delete
            </button>
            <button
              type="button"
              className="project-button"
              onClick={() => onSetPendingDeleteComponent(null)}
            >
              Cancel
            </button>
          </div>
        </section>
      ) : null}

      {addError ? <p>{addError}</p> : null}
      {connectionError ? <p>{connectionError}</p> : null}
      {componentError ? <p>{componentError}</p> : null}
    </>
  );
}

export default ProjectArchitectureTab;
