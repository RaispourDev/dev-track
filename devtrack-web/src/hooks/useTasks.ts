import { useCallback, useState } from "react";

import {
  createTask,
  deleteTask as deleteTaskApi,
  getTasks,
  updateTask,
} from "../api/tasks";

export type Task = {
  id: number;
  projectId: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.id === "number" &&
    typeof task.projectId === "number" &&
    typeof task.title === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "string"
  );
}

function isTaskArray(value: unknown): value is Task[] {
  return Array.isArray(value) && value.every(isTask);
}

function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [taskErrors, setTaskErrors] = useState<Record<number, string>>({});

  const loadTasks = useCallback(async (projectId: number) => {
    try {
      const tasksApi: unknown = await getTasks(projectId);

      if (!isTaskArray(tasksApi)) {
        throw new Error("Invalid tasks data");
      }

      setTasks((currentTasks) => {
        const otherTasks = currentTasks.filter(
          (task) => task.projectId !== projectId,
        );

        return [...otherTasks, ...tasksApi];
      });
    } catch {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "Could not load tasks.",
      }));
    }
  }, []);

  async function addTask(projectId: number, title: string) {
    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 2) {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "Task title must be at least 2 characters.",
      }));

      return;
    }

    const taskExists = tasks.some(
      (task) =>
        task.projectId === projectId &&
        task.title.toLowerCase() === trimmedTitle.toLowerCase(),
    );

    if (taskExists) {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "A task with this title already exists in this project.",
      }));

      return;
    }

    try {
      const createdTask: unknown = await createTask(projectId, trimmedTitle);

      if (!isTask(createdTask)) {
        throw new Error("Invalid task data");
      }

      setTasks((currentTasks) => [...currentTasks, createdTask]);

      clearTaskError(projectId);
    } catch (error) {
      console.error("EDIT TASK ERROR:", error);

      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "This task could not be updated.",
      }));
    }
  }

  async function deleteTask(projectId: number, taskId: number) {
    try {
      await deleteTaskApi(projectId, taskId);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    } catch {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "This task could not be deleted.",
      }));
    }
  }

  async function editTask(
    projectId: number,
    taskId: number,
    newTitle: string,
  ): Promise<boolean> {
    const trimmedTitle = newTitle.trim();

    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask) {
      return false;
    }

    if (trimmedTitle.length < 2) {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "Task title must be at least 2 characters.",
      }));

      return false;
    }

    const taskExists = tasks.some(
      (task) =>
        task.id !== taskId &&
        task.projectId === projectId &&
        task.title.toLowerCase() === trimmedTitle.toLowerCase(),
    );

    if (taskExists) {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "A task with this title already exists in this project.",
      }));

      return false;
    }

    try {
      const updatedTask: unknown = await updateTask(
        projectId,
        taskId,
        trimmedTitle,
        currentTask.completed,
      );

      if (!isTask(updatedTask)) {
        throw new Error("Invalid task data");
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );

      clearTaskError(projectId);

      return true;
    } catch {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "This task could not be updated.",
      }));

      return false;
    }
  }

  async function toggleTask(projectId: number, taskId: number) {
    const currentTask = tasks.find((task) => task.id === taskId);

    if (!currentTask) {
      return;
    }

    try {
      const updatedTask: unknown = await updateTask(
        projectId,
        taskId,
        currentTask.title,
        !currentTask.completed,
      );

      if (!isTask(updatedTask)) {
        throw new Error("Invalid task data");
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === taskId ? updatedTask : task)),
      );
    } catch {
      setTaskErrors((currentErrors) => ({
        ...currentErrors,
        [projectId]: "This task could not be updated.",
      }));
    }
  }

  function getTasksByProject(projectId: number) {
    return tasks.filter((task) => task.projectId === projectId);
  }

  function getTaskCount(projectId: number) {
    return tasks.filter((task) => task.projectId === projectId).length;
  }

  function deleteTasksByProject(projectId: number) {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.projectId !== projectId),
    );

    setTaskErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[projectId];

      return nextErrors;
    });
  }

  function clearTaskError(projectId: number) {
    setTaskErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[projectId];

      return nextErrors;
    });
  }

  return {
    tasks,
    taskErrors,
    loadTasks,
    addTask,
    deleteTask,
    editTask,
    toggleTask,
    getTasksByProject,
    getTaskCount,
    deleteTasksByProject,
    clearTaskError,
  };
}

export default useTasks;
