import { useState } from "react";
import type { Task } from "../hooks/useTasks";

type ProjectCardProps = {
  name: string;
  status: "ACTIVE" | "COMPLETED";
  taskCount: number;
  tasks: Task[];

  projectError: string;
  taskError: string;

  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: (newName: string) => Promise<boolean>;
  onStatusChange: () => void;

  onClearProjectError: () => void;
  onClearTaskError: () => void;

  onAddTask: (title: string) => void;
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, newTitle: string) => void;
};

function ProjectCard({
  name,
  status,
  taskCount,
  tasks,
  projectError,
  taskError,
  onDelete,
  onMoveUp,
  onMoveDown,
  onEdit,
  onStatusChange,
  onClearProjectError,
  onClearTaskError,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);

  const [newTaskTitle, setNewTaskTitle] = useState("");

  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState("");

  const trimmedName = newName.trim();

  async function handleEditProject() {
    const success = await onEdit(trimmedName);

    if (success) {
      setIsEditing(false);
    }
  }

  function handleCancelProjectEdit() {
    setNewName(name);
    onClearProjectError();
    setIsEditing(false);
  }

  function handleAddTask() {
    onAddTask(newTaskTitle);
    setNewTaskTitle("");
  }

  function handleStartTaskEdit(task: Task) {
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
    onClearTaskError();
  }

  function handleCancelTaskEdit() {
    setEditingTaskId(null);
    setEditingTaskTitle("");
    onClearTaskError();
  }

  function handleSaveTaskEdit() {
    if (editingTaskId === null) {
      return;
    }

    onEditTask(editingTaskId, editingTaskTitle);

    setEditingTaskId(null);
    setEditingTaskTitle("");
  }

  const completedTasks = tasks.filter((task) => task.completed).length;

  const progress =
    taskCount === 0 ? 0 : Math.round((completedTasks / taskCount) * 100);

  return (
    <article className="project-card">
      {/* Project Header */}
      <header className="project-card__header">
        <div className="project-card__title-area">
          {isEditing ? (
            <div className="project-card__edit">
              <input
                type="text"
                value={newName}
                autoFocus
                onChange={(event) => {
                  setNewName(event.target.value);
                  onClearProjectError();
                }}
              />

              <div className="project-card__edit-actions">
                <button type="button" onClick={handleEditProject}>
                  Save
                </button>

                <button type="button" onClick={handleCancelProjectEdit}>
                  Cancel
                </button>
              </div>

              {projectError && (
                <p className="error-message" role="alert">
                  {projectError}
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="project-card__name-row">
                <h3>{name}</h3>

                <button
                  type="button"
                  className="icon-button"
                  onClick={() => {
                    setNewName(name);
                    setIsEditing(true);
                  }}
                  aria-label={`Edit ${name}`}
                >
                  ✎
                </button>
                <button
                  type="button"
                  onClick={onMoveUp}
                  aria-label={`Move ${name} up`}
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={onMoveDown}
                  aria-label={`Move ${name} down`}
                >
                  ↓
                </button>
              </div>

              <span
                className={`status-badge ${
                  status === "ACTIVE"
                    ? "status-badge--active"
                    : "status-badge--completed"
                }`}
              >
                {status}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          className="delete-button"
          onClick={onDelete}
          aria-label={`Delete ${name}`}
        >
          Delete
        </button>
      </header>

      {/* Progress */}
      <div className="project-progress">
        <div className="project-progress__info">
          <span>
            {completedTasks} of {taskCount} tasks completed
          </span>

          <strong>{progress}%</strong>
        </div>

        <div className="project-progress__bar">
          <div
            className="project-progress__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Project Action */}
      {status === "ACTIVE" && (
        <button
          type="button"
          className="complete-project-button"
          onClick={onStatusChange}
        >
          ✓ Mark project as completed
        </button>
      )}

      {/* Tasks */}
      <section className="tasks-section">
        <div className="tasks-section__header">
          <div>
            <h4>Tasks</h4>

            <span>
              {taskCount} {taskCount === 1 ? "task" : "tasks"}
            </span>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-tasks">
            <span>○</span>

            <p>No tasks found.</p>
          </div>
        ) : (
          <ul className="task-list">
            {tasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${
                  task.completed ? "task-item--completed" : ""
                }`}
              >
                {editingTaskId === task.id ? (
                  <div className="task-edit">
                    <input
                      type="text"
                      value={editingTaskTitle}
                      autoFocus
                      onChange={(event) => {
                        setEditingTaskTitle(event.target.value);
                        onClearTaskError();
                      }}
                    />

                    <div className="task-edit__actions">
                      <button type="button" onClick={handleSaveTaskEdit}>
                        Save
                      </button>

                      <button type="button" onClick={handleCancelTaskEdit}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      className="task-checkbox"
                      onClick={() => onToggleTask(task.id)}
                      aria-label={
                        task.completed
                          ? `Mark ${task.title} as active`
                          : `Complete ${task.title}`
                      }
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <span className="task-title">{task.title}</span>

                    <div className="task-actions">
                      <button
                        type="button"
                        onClick={() => handleStartTaskEdit(task)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}

        {taskError && (
          <p className="error-message" role="alert">
            {taskError}
          </p>
        )}

        {/* Add Task */}
        <div className="add-task">
          <input
            type="text"
            value={newTaskTitle}
            placeholder="Add a new task..."
            onChange={(event) => {
              setNewTaskTitle(event.target.value);
              onClearTaskError();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleAddTask();
              }
            }}
          />

          <button type="button" onClick={handleAddTask}>
            + Add Task
          </button>
        </div>
      </section>
    </article>
  );
}

export default ProjectCard;
