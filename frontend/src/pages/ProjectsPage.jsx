import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  let content;

  if (loading) {
    content = <p>Loading projects...</p>;
  } else if (error) {
    content = <p>{error}</p>;
  } else {
    content = (
      <ul className="project-card__list">
        {projects.map((project) => (
          <li key={project.id} className="project-card__item">
            <div className="project-card__item-title">{project.name}</div>
            <div className="project-card__actions">
              <Link
                className="project-button project-button--primary"
                to={`/projects/${project.id}`}
              >
                Open Project
              </Link>
              <button
                type="button"
                className="project-button project-button--danger"
                onClick={() => handleDeleteProject(project.id)}
              >
                Delete Project
              </button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  async function loadProjects() {
    try {
      const response = await fetch("http://localhost:5000/api/projects");

      if (!response.ok) {
        throw new Error("Failed to load projects");
      }

      const data = await response.json();

      setProjects(data);
      setError("");
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isActive = true;

    async function loadInitialProjects() {
      try {
        const response = await fetch("http://localhost:5000/api/projects");

        if (!response.ok) {
          throw new Error("Failed to load projects");
        }

        const data = await response.json();

        if (isActive) {
          setProjects(data);
          setError("");
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError.message);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    loadInitialProjects();

    return () => {
      isActive = false;
    };
  }, []);

  async function handleCreateProject() {
    if (!newProjectName.trim()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newProjectName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      setNewProjectName("");
      await loadProjects();
    } catch (createError) {
      setError(createError.message);
    }
  }

  async function handleDeleteProject(projectId) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("Failed to delete project");
      }

      await loadProjects();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <main className="projects-page project-details-page">
      <section className="project-card project-card--full">
        <div className="project-card__header">
          <h2>Projects</h2>
        </div>

        <div className="project-field">
          <label htmlFor="create-project-name">Create Project</label>
          <input
            id="create-project-name"
            value={newProjectName}
            onChange={(event) => setNewProjectName(event.target.value)}
            placeholder="Project name"
          />
        </div>

        <div className="project-card__actions">
          <button
            type="button"
            className="project-button project-button--primary"
            onClick={handleCreateProject}
          >
            Create Project
          </button>
        </div>

        {content}
      </section>
    </main>
  );
}

export default ProjectsPage;
