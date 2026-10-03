export async function getTasks(projectId: number) {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}/tasks`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  return response.json();
}

export async function getTaskById(projectId: number, taskId: number) {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}/tasks/${taskId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch task");
  }

  return response.json();
}

export async function createTask(projectId: number, title: string) {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}/tasks`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  return response.json();
}

export async function updateTask(
  projectId: number,
  taskId: number,
  title: string,
  completed: boolean,
) {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}/tasks/${taskId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        completed,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  return response.json();
}

export async function deleteTask(projectId: number, taskId: number) {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}/tasks/${taskId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }
}
