import type { Task, TaskCreateInput, TaskUpdateInput } from "../types/task";

const API_BASE_URL = "http://localhost:8000";

const getToken = (): string | null => localStorage.getItem("access_token");

const authHeaders = (): Record<string, string> => {
  const token = getToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Произошла ошибка при выполнении запроса");
  }
  if (response.status === 204) {
    return null as T;
  }
  return response.json() as Promise<T>;
};

export const tasksApi = {
  getAll: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: {
        ...authHeaders(),
      },
    });
    return handleResponse<Task[]>(response);
  },

  getById: async (id: number): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: {
        ...authHeaders(),
      },
    });
    return handleResponse<Task>(response);
  },

  create: async (taskData: TaskCreateInput): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse<Task>(response);
  },

  update: async (id: number, taskData: TaskUpdateInput): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify(taskData),
    });
    return handleResponse<Task>(response);
  },

  delete: async (id: number): Promise<null> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        ...authHeaders(),
      },
    });
    return handleResponse<null>(response);
  },
};
