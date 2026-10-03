import "./App.css";
import { useEffect, useMemo, useState, type FormEvent } from "react";

import ProjectCard from "./components/ProjectCard";
import useProjects from "./hooks/useProjects";
import useTasks from "./hooks/useTasks";

type ProjectFilter = "all" | "active" | "completed";
type TaskFilter = "all" | "active" | "completed";

function App() {
  const [showProjects, setShowProjects] = useState(true);
  const [newProjectName, setNewProjectName] = useState("");
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const [taskFilter, setTaskFilter] = useState<TaskFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    projects,
    projectError,
    projectErrors,
    addProject,
    deleteProject,
    moveProjectUp,
    moveProjectDown,
    editProject,
    completeProject,
    clearProjectError,
    clearProjectEditError,
  } = useProjects();

  const {
    addTask,
    deleteTask,
    editTask,
    toggleTask,
    getTasksByProject,
    getTaskCount,
    deleteTasksByProject,
    taskErrors,
    clearTaskError,
    loadTasks,
  } = useTasks();

  useEffect(() => {
    projects.forEach((project) => {
      loadTasks(project.id);
    });
  }, [projects, loadTasks]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (projectFilter === "active") {
        return project.status === "ACTIVE";
      }

      if (projectFilter === "completed") {
        return project.status === "COMPLETED";
      }

      return true;
    });
  }, [projects, projectFilter]);

  function handleAddProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    addProject(newProjectName);

    if (newProjectName.trim().length >= 2) {
      setNewProjectName("");
    }
  }

  async function handleDeleteProject(projectId: number) {
    await deleteProject(projectId);
    deleteTasksByProject(projectId);
  }

  function getVisibleTasks(projectId: number) {
    const projectTasks = getTasksByProject(projectId);

    return projectTasks
      .filter((task) => {
        if (taskFilter === "active") {
          return !task.completed;
        }

        if (taskFilter === "completed") {
          return task.completed;
        }

        return true;
      })
      .filter((task) =>
        task.title.toLowerCase().includes(normalizedSearchQuery),
      );
  }

  const totalTasks = projects.reduce(
    (total, project) => total + getTaskCount(project.id),
    0,
  );

  const completedTasks = projects.reduce((total, project) => {
    return (
      total +
      getTasksByProject(project.id).filter((task) => task.completed).length
    );
  }, 0);

  const activeProjects = projects.filter(
    (project) => project.status === "ACTIVE",
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "COMPLETED",
  ).length;

  const overallProgress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <span className="app-eyebrow">DEVTRACK</span>

          <h1>Your development workspace</h1>

          <p>Keep your projects and tasks organized in one simple place.</p>
        </div>
      </header>

      <section className="overview">
        <div className="overview-card">
          <span>Projects</span>
          <strong>{projects.length}</strong>
        </div>

        <div className="overview-card">
          <span>Active</span>
          <strong>{activeProjects}</strong>
        </div>

        <div className="overview-card">
          <span>Completed</span>
          <strong>{completedProjects}</strong>
        </div>

        <div className="overview-card">
          <span>Task progress</span>
          <strong>{overallProgress}%</strong>
        </div>
      </section>

      <section className="workspace-controls">
        <div className="search-box">
          <label htmlFor="task-search">Search tasks</label>

          <input
            id="task-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tasks..."
          />
        </div>

        <div className="filter-group">
          <span>Projects</span>

          <div className="filter-buttons">
            <button
              type="button"
              className={projectFilter === "all" ? "filter-active" : ""}
              onClick={() => setProjectFilter("all")}
            >
              All
            </button>

            <button
              type="button"
              className={projectFilter === "active" ? "filter-active" : ""}
              onClick={() => setProjectFilter("active")}
            >
              Active
            </button>

            <button
              type="button"
              className={projectFilter === "completed" ? "filter-active" : ""}
              onClick={() => setProjectFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="filter-group">
          <span>Tasks</span>

          <div className="filter-buttons">
            <button
              type="button"
              className={taskFilter === "all" ? "filter-active" : ""}
              onClick={() => setTaskFilter("all")}
            >
              All
            </button>

            <button
              type="button"
              className={taskFilter === "active" ? "filter-active" : ""}
              onClick={() => setTaskFilter("active")}
            >
              Active
            </button>

            <button
              type="button"
              className={taskFilter === "completed" ? "filter-active" : ""}
              onClick={() => setTaskFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>
      </section>

      <section className="projects-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">WORKSPACE</span>

            <h2>Projects</h2>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setShowProjects((currentValue) => !currentValue)}
          >
            {showProjects ? "Hide projects" : "Show projects"}
          </button>
        </div>

        {showProjects && (
          <>
            {filteredProjects.length === 0 ? (
              <div className="empty-state">
                <span>○</span>

                <h3>No projects found</h3>

                <p>Try changing your filters or create a new project.</p>
              </div>
            ) : (
              <ul className="project-list">
                {filteredProjects.map((project) => (
                  <li key={project.id}>
                    <ProjectCard
                      name={project.name}
                      status={project.status}
                      taskCount={getTaskCount(project.id)}
                      tasks={getVisibleTasks(project.id)}
                      projectError={projectErrors[project.id] ?? ""}
                      taskError={taskErrors[project.id] ?? ""}
                      onDelete={() => handleDeleteProject(project.id)}
                      onMoveUp={() => moveProjectUp(project.id)}
                      onMoveDown={() => moveProjectDown(project.id)}
                      onEdit={(newName) => editProject(project.id, newName)}
                      onStatusChange={() => completeProject(project.id)}
                      onClearProjectError={() =>
                        clearProjectEditError(project.id)
                      }
                      onClearTaskError={() => clearTaskError(project.id)}
                      onAddTask={(title) => addTask(project.id, title)}
                      onToggleTask={(taskId) => toggleTask(project.id, taskId)}
                      onDeleteTask={(taskId) => deleteTask(project.id, taskId)}
                      onEditTask={(taskId, newTitle) =>
                        editTask(project.id, taskId, newTitle)
                      }
                    />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <section className="add-project-card">
        <div className="add-project-card-fixed">
          <span className="section-eyebrow">NEW PROJECT</span>

          <h2>Create a project</h2>

          <p>Start tracking a new learning or development goal.</p>
        </div>

        <form onSubmit={handleAddProject} className="add-project-form">
          <label htmlFor="project-name">Project name</label>

          <div className="add-project-input">
            <input
              id="project-name"
              name="projectName"
              type="text"
              required
              minLength={2}
              value={newProjectName}
              onChange={(event) => {
                setNewProjectName(event.target.value);
                clearProjectError();
              }}
              placeholder="e.g. Learn TypeScript"
            />

            <button type="submit">Add project</button>
          </div>

          {projectError && (
            <p className="error-message" role="alert">
              {projectError}
            </p>
          )}

          {newProjectName.trim() !== "" && !projectError && (
            <small>
              Creating: <strong>{newProjectName.trim()}</strong>
            </small>
          )}
        </form>
      </section>
    </main>
  );
}

export default App;
