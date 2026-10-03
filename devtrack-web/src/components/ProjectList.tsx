import ProjectCard from "./ProjectCard";
import type { Project } from "../hooks/useProjects";
import type { Task } from "../hooks/useTasks";

type ProjectListProps = {
  projects: Project[];

  getTasksByProject: (projectId: number) => Task[];
  getTaskCount: (projectId: number) => number;

  projectErrors: Record<number, string>;
  taskErrors: Record<number, string>;

  onDeleteProject: (projectId: number) => void;
  onEditProject: (projectId: number, newName: string) => boolean;
  onCompleteProject: (projectId: number) => void;

  onAddTask: (projectId: number, title: string) => void;
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
  onEditTask: (taskId: number, newTitle: string) => void;

  onClearProjectError: (projectId: number) => void;
  onClearTaskError: (projectId: number) => void;

  searchQuery: string;
  taskFilter: "all" | "active" | "completed";
};

function ProjectList({
  projects,
  getTasksByProject,
  getTaskCount,
  projectErrors,
  taskErrors,
  onDeleteProject,
  onEditProject,
  onCompleteProject,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onClearProjectError,
  onClearTaskError,
  searchQuery,
  taskFilter,
}: ProjectListProps) {
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  return (
    <div className="project-list">
      {projects.map((project) => {
        const projectTasks = getTasksByProject(project.id);

        const filteredTasks = projectTasks
          .filter((task) => {
            if (taskFilter === "active") {
              return !task.completed;
            }

            if (taskFilter === "completed") {
              return task.completed;
            }

            return true;
          })
          .filter((task) => {
            if (normalizedSearchQuery === "") {
              return true;
            }

            return task.title.toLowerCase().includes(normalizedSearchQuery);
          });

        return (
          <ProjectCard
            key={project.id}
            name={project.name}
            status={project.status}
            taskCount={getTaskCount(project.id)}
            tasks={filteredTasks}
            projectError={projectErrors[project.id] ?? ""}
            taskError={taskErrors[project.id] ?? ""}
            onDelete={() => onDeleteProject(project.id)}
            onEdit={(newName) => onEditProject(project.id, newName)}
            onStatusChange={() => onCompleteProject(project.id)}
            onClearProjectError={() => onClearProjectError(project.id)}
            onClearTaskError={() => onClearTaskError(project.id)}
            onAddTask={(title) => onAddTask(project.id, title)}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        );
      })}
    </div>
  );
}

export default ProjectList;
