export type ProjectStatus = "ACTIVE" | "COMPLETED";

export type Project = {
  id: number;
  name: string;
  status: ProjectStatus;
  createdAt: string;
};

export async function getProjects(): Promise<Project[]> {
  const response = await fetch("http://localhost:3000/api/v1/projects");

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

export async function getProjectById(projectId: number): Promise<Project> {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project");
  }

  return response.json();
}

export async function createProject(name: string): Promise<Project> {
  const response = await fetch("http://localhost:3000/api/v1/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    throw new Error("Failed to create project");
  }

  return response.json();
}

export async function updateProject(
  projectId: number,
  newName: string,
): Promise<Project> {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to update project");
  }

  return response.json();
}

export async function completeProject(projectId: number): Promise<Project> {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "COMPLETED",
      }),
    },
  );

  if (!response.ok) {
    throw new Error("Failed to complete project");
  }

  return response.json();
}

export async function deleteProject(projectId: number): Promise<Project> {
  const response = await fetch(
    `http://localhost:3000/api/v1/projects/${projectId}`,
    {
      method: "DELETE",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to delete project");
  }

  return response.json();
}
