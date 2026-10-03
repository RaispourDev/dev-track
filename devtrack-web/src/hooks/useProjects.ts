import { useEffect, useState } from "react";

import {
  completeProject as completeProjectApi,
  createProject,
  deleteProject as deleteProjectApi,
  getProjects,
  updateProject,
  type Project,
  type ProjectStatus,
} from "../api/projects";

export type { Project, ProjectStatus };

function isProject(value: unknown): value is Project {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const project = value as Record<string, unknown>;

  return (
    typeof project.id === "number" &&
    typeof project.name === "string" &&
    (project.status === "ACTIVE" || project.status === "COMPLETED") &&
    typeof project.createdAt === "string"
  );
}

function isProjectArray(value: unknown): value is Project[] {
  return Array.isArray(value) && value.every(isProject);
}

function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  const [projectError, setProjectError] = useState("");

  const [projectErrors, setProjectErrors] = useState<Record<number, string>>(
    {},
  );

  useEffect(() => {
    async function loadProjects() {
      try {
        const projectsApi = await getProjects();

        if (isProjectArray(projectsApi)) {
          setProjects(projectsApi);
        } else {
          setProjectError("Invalid projects data received.");
        }
      } catch {
        setProjectError("Could not load projects.");
      }
    }

    loadProjects();
  }, []);

  async function addProject(name: string) {
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setProjectError("Project name must be at least 2 characters.");
      return;
    }

    const projectExists = projects.some(
      (project) => project.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (projectExists) {
      setProjectError("A project with this name already exists.");
      return;
    }

    try {
      const createdProject = await createProject(trimmedName);

      setProjects((currentProjects) => [...currentProjects, createdProject]);

      setProjectError("");
    } catch {
      setProjectError("This project could not be created.");
    }
  }

  async function deleteProject(projectId: number) {
    try {
      await deleteProjectApi(projectId);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId),
      );

      setProjectErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        delete nextErrors[projectId];

        return nextErrors;
      });
    } catch {
      setProjectError("This project could not be deleted.");
    }
  }

  function moveProjectUp(projectId: number) {
    const projectIndex = projects.findIndex(
      (project) => project.id === projectId,
    );

    if (projectIndex === 0 || projectIndex === -1) {
      return;
    }

    setProjects((currentProjects) => {
      const nextProjects = [...currentProjects];

      [nextProjects[projectIndex], nextProjects[projectIndex - 1]] = [
        nextProjects[projectIndex - 1],
        nextProjects[projectIndex],
      ];

      return nextProjects;
    });
  }

  function moveProjectDown(projectId: number) {
    const projectIndex = projects.findIndex(
      (project) => project.id === projectId,
    );

    if (projectIndex === projects.length - 1 || projectIndex === -1) {
      return;
    }

    setProjects((currentProjects) => {
      const nextProjects = [...currentProjects];

      [nextProjects[projectIndex], nextProjects[projectIndex + 1]] = [
        nextProjects[projectIndex + 1],
        nextProjects[projectIndex],
      ];

      return nextProjects;
    });
  }

  async function editProject(
    projectId: number,
    newName: string,
  ): Promise<boolean> {
    const trimmedName = newName.trim();

    if (trimmedName.length < 2) {
      setProjectErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "Project name must be at least 2 characters.",
      }));

      return false;
    }

    const projectExists = projects.some(
      (project) =>
        project.id !== projectId &&
        project.name.toLowerCase() === trimmedName.toLowerCase(),
    );

    if (projectExists) {
      setProjectErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "A project with this name already exists.",
      }));

      return false;
    }

    try {
      const updatedProject = await updateProject(projectId, trimmedName);

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId ? updatedProject : project,
        ),
      );

      setProjectErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        delete nextErrors[projectId];

        return nextErrors;
      });

      return true;
    } catch {
      setProjectErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "This project could not be updated.",
      }));

      return false;
    }
  }

  async function completeProject(projectId: number) {
    try {
      const updatedProject = await completeProjectApi(projectId);

      setProjects((currentProjects) =>
        currentProjects.map((project) =>
          project.id === projectId ? updatedProject : project,
        ),
      );
    } catch {
      setProjectError("This project could not be completed.");
    }
  }

  function clearProjectError() {
    setProjectError("");
  }

  function clearProjectEditError(projectId: number) {
    setProjectErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[projectId];

      return nextErrors;
    });
  }

  return {
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
  };
}

export default useProjects;
